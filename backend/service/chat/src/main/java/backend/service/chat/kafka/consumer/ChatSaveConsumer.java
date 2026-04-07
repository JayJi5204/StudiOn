package backend.service.chat.kafka.consumer;

import backend.service.chat.entity.ChatEntity;
import backend.service.chat.repository.ChatRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatSaveConsumer {

    private final ChatRepository chatRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "chat.message", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            ChatEntity entity = objectMapper.readValue(message, ChatEntity.class);
            chatRepository.save(entity);
            log.info("채팅 메시지 저장 완료 roomId={}", entity.getRoomId());
        } catch (Exception e) {
            log.error("채팅 메시지 저장 실패", e);
        }
    }
}