package backend.service.room.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.common.kafkaEvent.ranking.StudyTimeEvent;
import backend.common.util.SecurityUtil;
import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.GetRoomResponse;
import backend.service.room.entity.RoomEntity;
import backend.service.room.repository.RoomRepository;
import backend.service.room.util.SignalingHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final Snowflake snowflake = new Snowflake();
    private final StringRedisTemplate stringRedisTemplate;
    private final KafkaProducer kafkaProducer;
    private final ApplicationContext applicationContext;

    @Override
    @Transactional
    public CreateResponse create(CreateRequest request, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        RoomEntity room = RoomEntity.create(
                snowflake.nextId(),
                request.getRoomName(),
                userId,
                request.isPrivate(),
                request.getPassword(),
                inviteCode
        );

        roomRepository.save(room);

        return CreateResponse.from(room);
    }

    @Override
    public GetRoomResponse getRoom(Long roomId) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));
        return GetRoomResponse.from(room);
    }

    @Override
    public void invite(Long roomId, Long targetUserId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        if (!room.getHostId().equals(userId)) {
            throw new CustomException(ErrorCode.ROOM_UNAUTHORIZED);
        }

        kafkaProducer.send("alarm", new AlarmEvent(
                targetUserId,
                "ROOM_INVITE",
                room.getRoomName() + " 방에 초대되었습니다. 초대코드: " + room.getInviteCode(),
                roomId
        ));
    }



    @Override
    @Transactional
    public void forceDelete(Long roomId, HttpServletRequest request) {
        String role = SecurityUtil.getCurrentUserRole(request);
        if (!role.equals("ADMIN")) {
            throw new CustomException(ErrorCode.ADMIN_UNAUTHORIZED);
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        // Redis 정리 및 참여자 알람
        Set<String> participants = stringRedisTemplate.opsForSet().members("room:participants:" + roomId);
        if (participants != null) {
            for (String userId : participants) {
                stringRedisTemplate.delete("user:room:" + userId);
                stringRedisTemplate.delete("study:start:" + userId);

                kafkaProducer.send("alarm", new AlarmEvent(
                        Long.valueOf(userId),
                        "ROOM_FORCE_DELETED",
                        "[" + room.getRoomName() + "] 방이 관리자에 의해 강제 종료되었습니다.",
                        roomId
                ));
            }
        }
        stringRedisTemplate.delete("room:participants:" + roomId);
        roomRepository.delete(room);

        try {
            SignalingHandler signalingHandler = applicationContext.getBean(SignalingHandler.class);
            signalingHandler.forceCloseRoom(String.valueOf(roomId));
        } catch (Exception e) {
            log.error("WebSocket 강제 종료 실패 roomId={}", roomId, e);
        }
    }

    @Override
    public List<GetRoomResponse> getAllRooms(String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return roomRepository.findByRoomNameContaining(keyword)
                    .stream()
                    .map(GetRoomResponse::from)
                    .toList();
        }
        return roomRepository.findAll().stream()
                .map(GetRoomResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public void joinRoom(Long roomId, Long userId) {
        String currentRoomId = stringRedisTemplate.opsForValue().get("user:room:" + userId);
        if (currentRoomId != null) {
            throw new CustomException(ErrorCode.ALREADY_IN_ROOM);
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        if (room.getCurrentPeople() >= room.getMaxPeople()) {
            throw new CustomException(ErrorCode.ROOM_FULL);
        }

        room.enter();
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(roomId));
        stringRedisTemplate.opsForSet().add("room:participants:" + roomId, String.valueOf(userId));
        stringRedisTemplate.opsForValue().set("study:start:" + userId, String.valueOf(System.currentTimeMillis()));
        log.info("방 입장 roomId={}, userId={}", roomId, userId);
    }

    @Override
    @Transactional
    public void leaveRoom(Long roomId, Long userId) {
        RoomEntity room = roomRepository.findByIdWithLock(roomId).orElse(null);
        if (room == null) return;

        room.leave();
        stringRedisTemplate.delete("user:room:" + userId);
        stringRedisTemplate.opsForSet().remove("room:participants:" + roomId, String.valueOf(userId));

        String startTimeStr = stringRedisTemplate.opsForValue().get("study:start:" + userId);
        if (startTimeStr != null) {
            long startTime = Long.parseLong(startTimeStr);
            long studySeconds = (System.currentTimeMillis() - startTime) / 1000;
            String today = LocalDate.now().toString();
            kafkaProducer.send("study.time", new StudyTimeEvent(userId, studySeconds, today));
            stringRedisTemplate.delete("study:start:" + userId);
        }

        if (room.getCurrentPeople() <= 0) {
            roomRepository.delete(room);
        }
        log.info("방 퇴장 roomId={}, userId={}", roomId, userId);
    }

    @Override
    public GetRoomResponse getRoomByInviteCode(String inviteCode) {
        RoomEntity room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INVITE_CODE));
        return GetRoomResponse.from(room);
    }

    @Transactional
    public void leaveRoomWithoutLock(Long roomId, Long userId) {
        RoomEntity room = roomRepository.findById(roomId).orElse(null);
        if (room == null) return;

        room.leave();
        stringRedisTemplate.delete("user:room:" + userId);
        stringRedisTemplate.opsForSet().remove("room:participants:" + roomId, String.valueOf(userId));

        String startTimeStr = stringRedisTemplate.opsForValue().get("study:start:" + userId);
        if (startTimeStr != null) {
            long startTime = Long.parseLong(startTimeStr);
            long studySeconds = (System.currentTimeMillis() - startTime) / 1000;
            String today = LocalDate.now().toString();
            kafkaProducer.send("study.time", new StudyTimeEvent(userId, studySeconds, today));
            stringRedisTemplate.delete("study:start:" + userId);
        }

        if (room.getCurrentPeople() <= 0) {
            roomRepository.delete(room);
        }
        log.info("방 퇴장 (락 없음) roomId={}, userId={}", roomId, userId);
    }


}