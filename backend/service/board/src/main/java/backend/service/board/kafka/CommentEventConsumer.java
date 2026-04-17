package backend.service.board.kafka;

import backend.common.kafkaEvent.comment.CommentCreatedEvent;
import backend.common.kafkaEvent.comment.CommentDeletedEvent;
import backend.service.board.service.BoardCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommentEventConsumer {

    private final BoardCountService boardCountService;

    @KafkaListener(topics = "comment.created", groupId = "${spring.application.name}-group")
    public void commentCreated(CommentCreatedEvent event) {
        boardCountService.incrementCommentCount(event.boardId());
        log.info("댓글 수 증가 boardId={}", event.boardId());
    }

    @KafkaListener(topics = "comment.deleted", groupId = "${spring.application.name}-group")
    public void commentDeleted(CommentDeletedEvent event) {
        boardCountService.decrementCommentCount(event.boardId());
        log.info("댓글 수 감소 boardId={}", event.boardId());
    }
}