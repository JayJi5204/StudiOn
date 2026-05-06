package backend.service.board.kafka;

import backend.common.kafkaEvent.comment.CommentCreatedEvent;
import backend.service.board.service.BoardCountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommentCreatedConsumer {

    private final BoardCountService boardCountService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "comment.created", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            CommentCreatedEvent event = objectMapper.readValue(message, CommentCreatedEvent.class);
            boardCountService.incrementCommentCount(event.boardId());
            log.info("댓글 수 증가 boardId={}", event.boardId());
        } catch (Exception e) {
            log.error("댓글 수 증가 실패", e);
        }
    }
}