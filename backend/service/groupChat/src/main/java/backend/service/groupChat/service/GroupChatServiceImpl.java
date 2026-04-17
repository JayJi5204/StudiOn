package backend.service.groupChat.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.service.groupChat.dto.response.CreateResponse;
import backend.service.groupChat.entity.GroupChatEntity;
import backend.service.groupChat.feign.RoomClient;
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

    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaProducer kafkaProducer;
    private final RoomClient roomClient;
    private final Snowflake snowflake = new Snowflake();

    private static final String CHAT_TOPIC = "group-chat:room:";

    @Override
    @Transactional
    public void sendMessage(Long roomId, String message, Long userId, String nickName) {

        if (message == null || message.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_MESSAGE);
        }
        if (message.length() > 500) {
            throw new CustomException(ErrorCode.GROUP_MESSAGE_TOO_LONG);
        }

        try {
            roomClient.getRoom(roomId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ROOM_NOT_FOUND);
        }

        GroupChatEntity entity = GroupChatEntity.create(
                snowflake.nextId(), roomId, userId, nickName, message
        );

        CreateResponse response = CreateResponse.from(entity);

        redisTemplate.convertAndSend(CHAT_TOPIC + roomId, response);
        kafkaProducer.send("group-chat.message", entity);
    }
}