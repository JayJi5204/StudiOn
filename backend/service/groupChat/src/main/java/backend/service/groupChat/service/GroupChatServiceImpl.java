package backend.service.groupChat.service;

import backend.common.id.Snowflake;
import backend.service.groupChat.dto.response.CreateResponse;
import backend.service.groupChat.entity.GroupChatEntity;
import backend.service.groupChat.feign.RoomClient;
import backend.service.groupChat.kafka.KafkaProducer;
import backend.service.groupChat.repository.GroupChatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class GroupChatServiceImpl implements GroupChatService {

    private final GroupChatRepository groupChatRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaProducer kafkaProducer;
    private final RoomClient roomClient;
    private final Snowflake snowflake = new Snowflake();

    private static final String CHAT_TOPIC = "group-chat:room:";

    @Override
    @Transactional
    public void sendMessage(Long roomId, String message, Long userId, String nickName) {

        // room-service에서 방 존재 여부 확인
        try {
            roomClient.getRoom(roomId);
        } catch (Exception e) {
            throw new RuntimeException("방이 존재하지 않습니다.");
        }

        GroupChatEntity entity = GroupChatEntity.create(
                snowflake.nextId(), roomId, userId, nickName, message
        );

        CreateResponse response = CreateResponse.from(entity);

        // Redis pub/sub으로 실시간 전달
        redisTemplate.convertAndSend(CHAT_TOPIC + roomId, response);

        // Kafka로 DB 저장
        kafkaProducer.send("group-chat.message", entity);
    }

}