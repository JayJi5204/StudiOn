package backend.service.groupChat.service;

import backend.service.groupChat.dto.response.CreateResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupChatSubscriber implements MessageListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis에서 받은 메시지 역직렬화
            String body = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            CreateResponse chatMessage = objectMapper.readValue(body, CreateResponse.class);
            log.info("Redis 수신 body={}", body);  // 추가
            // WebSocket으로 구독자들에게 전달
            messagingTemplate.convertAndSend("/sub/group-chat/" + chatMessage.getRoomId(), chatMessage);

            log.info("메시지 전달 roomId={}", chatMessage.getRoomId());
        } catch (Exception e) {
            log.error("메시지 처리 오류", e);
        }
    }
}