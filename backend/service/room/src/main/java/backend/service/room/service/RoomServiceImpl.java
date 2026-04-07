package backend.service.room.service;

import backend.common.id.Snowflake;
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

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final Snowflake snowflake = new Snowflake();
    private final StringRedisTemplate stringRedisTemplate;

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

        // 방 생성자를 Redis에 추가
        stringRedisTemplate.opsForSet().add("room:participants:" + room.getRoomId(), String.valueOf(userId));
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(room.getRoomId()));

        return CreateResponse.from(room);
    }

    @Override
    public CreateResponse getRoom(Long roomId) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방이 존재하지 않습니다."));
        return CreateResponse.from(room);
    }

    @Override
    @Transactional
    public EnterResponse enter(Long roomId, String password, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        String currentRoomId = stringRedisTemplate.opsForValue().get("user:room:" + userId);
        if (currentRoomId != null) {
            throw new RuntimeException("이미 다른 방에 입장중입니다.");
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방이 존재하지 않습니다."));

        if (room.isPrivate()) {
            if (!room.checkPassword(password)) {
                throw new RuntimeException("비밀번호가 틀렸습니다.");
            }
        }

        if (room.getCurrentPeople() >= room.getMaxPeople()) {
            throw new RuntimeException("방이 꽉 찼습니다.");
        }

        room.enter();
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(roomId));
        stringRedisTemplate.opsForSet().add("room:participants:" + roomId, String.valueOf(userId));

        return EnterResponse.from(room);
    }

    @Override
    @Transactional
    public LeaveResponse leave(Long roomId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("방이 존재하지 않습니다."));

        room.leave();
        stringRedisTemplate.delete("user:room:" + userId);

        stringRedisTemplate.opsForSet().remove("room:participants:" + roomId, String.valueOf(userId));

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
            throw new RuntimeException("이미 다른 방에 입장중입니다.");
        }

        RoomEntity room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 초대코드입니다."));

        if (room.getCurrentPeople() >= room.getMaxPeople()) {
            throw new RuntimeException("방이 꽉 찼습니다.");
        }

        room.enter();
        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(room.getRoomId()));

        return EnterResponse.from(room);
    }
}