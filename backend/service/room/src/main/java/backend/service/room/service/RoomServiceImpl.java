package backend.service.room.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.common.kafkaEvent.ranking.StudyTimeEvent;
import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.EnterResponse;
import backend.service.room.dto.response.LeaveResponse;
import backend.service.room.entity.RoomEntity;
import backend.service.room.repository.RoomRepository;
import backend.service.room.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final Snowflake snowflake = new Snowflake();
    private final StringRedisTemplate stringRedisTemplate;
    private final KafkaProducer kafkaProducer;

    @Override
    @Transactional
    public CreateResponse create(CreateRequest request, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        String inviteCode = UUID.randomUUID().toString().substring(0, 8);

        RoomEntity room = RoomEntity.create(
                snowflake.nextId(),
                request.getRoomName(),
                userId,
                request.isPrivate(),
                request.getPassword(),
                inviteCode
        );

        roomRepository.save(room);

        stringRedisTemplate.opsForSet().add("room:participants:" + room.getRoomId(), String.valueOf(userId));
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(room.getRoomId()));
        stringRedisTemplate.opsForValue().set("study:start:" + userId, String.valueOf(System.currentTimeMillis()));

        return CreateResponse.from(room);
    }

    @Override
    public CreateResponse getRoom(Long roomId) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));
        return CreateResponse.from(room);
    }

    @Override
    @Transactional
    public EnterResponse enter(Long roomId, String password, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        String currentRoomId = stringRedisTemplate.opsForValue().get("user:room:" + userId);
        if (currentRoomId != null) {
            throw new CustomException(ErrorCode.ALREADY_IN_ROOM);
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        if (room.isPrivate()) {
            if (!room.checkPassword(password)) {
                throw new CustomException(ErrorCode.INVALID_PASSWORD_ROOM);
            }
        }

        if (room.getCurrentPeople() >= room.getMaxPeople()) {
            throw new CustomException(ErrorCode.ROOM_FULL);
        }

        room.enter();
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(roomId));
        stringRedisTemplate.opsForSet().add("room:participants:" + roomId, String.valueOf(userId));
        stringRedisTemplate.opsForValue().set("study:start:" + userId, String.valueOf(System.currentTimeMillis()));

        return EnterResponse.from(room);
    }

    @Override
    @Transactional
    public LeaveResponse leave(Long roomId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new CustomException(ErrorCode.ROOM_NOT_FOUND));

        room.leave();
        stringRedisTemplate.delete("user:room:" + userId);
        stringRedisTemplate.opsForSet().remove("room:participants:" + roomId, String.valueOf(userId));

        // 공부시간 계산 후 Kafka 발행
        String startTimeStr = stringRedisTemplate.opsForValue().get("study:start:" + userId);
        if (startTimeStr != null) {
            long startTime = Long.parseLong(startTimeStr);
            long studyMinutes = (System.currentTimeMillis() - startTime) / 1000 / 60;
            String today = LocalDate.now().toString();

            kafkaProducer.send("study.time", new StudyTimeEvent(userId, studyMinutes, today));
            stringRedisTemplate.delete("study:start:" + userId);
        }

        if (room.getCurrentPeople() <= 0) {
            roomRepository.delete(room);
        }

        return LeaveResponse.from(room);
    }

    @Override
    @Transactional
    public EnterResponse enterByInviteCode(String inviteCode, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        String currentRoomId = stringRedisTemplate.opsForValue().get("user:room:" + userId);
        if (currentRoomId != null) {
            throw new CustomException(ErrorCode.ALREADY_IN_ROOM);
        }

        RoomEntity room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_INVITE_CODE));

        if (room.getCurrentPeople() >= room.getMaxPeople()) {
            throw new CustomException(ErrorCode.ROOM_FULL);
        }

        room.enter();
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(room.getRoomId()));

        return EnterResponse.from(room);
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
}