package backend.service.chat.service;

import backend.common.id.Snowflake;
import backend.service.chat.dto.response.CreateResponse;
import backend.service.chat.entity.ChatEntity;
import backend.service.chat.kafka.KafkaProducer;
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
        ChatEntity entity = ChatEntity.create(snowflake.nextId(), roomId, userId, nickName, message);

        CreateResponse response = CreateResponse.from(entity);

        // Entity 대신 DTO를 Redis에 발행
        redisTemplate.convertAndSend(CHAT_TOPIC + roomId, response);

        // Kafka로 발행
        kafkaProducer.send("chat.message", entity);

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