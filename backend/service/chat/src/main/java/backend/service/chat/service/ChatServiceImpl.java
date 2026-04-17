package backend.service.chat.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.service.chat.dto.response.CreateResponse;
import backend.service.chat.entity.ChatEntity;
import backend.service.chat.repository.ChatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final Snowflake snowflake = new Snowflake();
    private final KafkaProducer kafkaProducer;

    private static final String CHAT_TOPIC = "chat:room:";

    @Override
    @Transactional
    public void sendMessage(String roomId, String message, Long userId, String nickName) {

        if (message == null || message.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_MESSAGE);
        }
        if (message.length() > 300) {
            throw new CustomException(ErrorCode.MESSAGE_TOO_LONG);
        }

        ChatEntity entity = ChatEntity.create(snowflake.nextId(), roomId, userId, nickName, message);
        CreateResponse response = CreateResponse.from(entity);

        redisTemplate.convertAndSend(CHAT_TOPIC + roomId, response);
        kafkaProducer.send("chat.message", entity);

        try {
            String[] ids = roomId.split(":");
            if (ids.length != 2) throw new CustomException(ErrorCode.INVALID_ROOM_ID);

            Long user1 = Long.parseLong(ids[0]);
            Long user2 = Long.parseLong(ids[1]);
            Long receiverId = userId.equals(user1) ? user2 : user1;

            kafkaProducer.send("alarm", new AlarmEvent(
                    receiverId,
                    "CHAT",
                    nickName + "님이 메시지를 보냈습니다",
                    null
            ));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("채팅 알림 발행 실패", e);
        }
    }

    @Override
    public List<CreateResponse> getMessages(String roomId, Pageable pageable) {
        return chatRepository.findByRoomIdOrderBySendAtDesc(roomId, pageable)
                .stream()
                .map(CreateResponse::from)
                .toList();
    }

    @Override
    public List<CreateResponse> getMessagesBefore(String roomId, LocalDateTime sendAt, Pageable pageable) {
        return chatRepository.findByRoomIdAndSendAtBeforeOrderBySendAtDesc(roomId, sendAt, pageable)
                .stream()
                .map(CreateResponse::from)
                .toList();
    }

    @Override
    public String createRoomId(Long userId1, Long userId2) {
        return ChatEntity.createRoomId(userId1, userId2);
    }
}