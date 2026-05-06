package backend.service.board.kafka;

import backend.common.kafkaEvent.comment.CommentDeletedEvent;
import backend.service.board.service.BoardCountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommentDeletedConsumer {

    private final BoardCountService boardCountService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "comment.deleted", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            CommentDeletedEvent event = objectMapper.readValue(message, CommentDeletedEvent.class);
            boardCountService.decrementCommentCount(event.boardId());
            log.info("댓글 수 감소 boardId={}", event.boardId());
        } catch (Exception e) {
            log.error("댓글 수 감소 실패", e);
        }
    }
}