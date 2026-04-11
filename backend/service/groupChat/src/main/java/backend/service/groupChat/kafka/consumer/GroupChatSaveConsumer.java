package backend.service.groupChat.kafka.consumer;

import backend.service.groupChat.entity.GroupChatEntity;
import backend.service.groupChat.repository.GroupChatRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupChatSaveConsumer {

    private final GroupChatRepository groupChatRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "group-chat.message", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            GroupChatEntity entity = objectMapper.readValue(message, GroupChatEntity.class);
            groupChatRepository.save(entity);
            log.info("채팅 메시지 저장 완료 roomId={}", entity.getRoomId());
        } catch (Exception e) {
            log.error("채팅 메시지 저장 실패", e);
        }
    }
}