package backend.service.board.kafka.comsumer;

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
    public void commentCreated(String message) {
        try {
            // boardId 파싱
            Long boardId = Long.parseLong(message);
            boardCountService.incrementCommentCount(boardId);
            log.info("댓글 수 증가 boardId={}", boardId);
        } catch (Exception e) {
            log.error("댓글 생성 이벤트 처리 실패", e);
        }
    }

    @KafkaListener(topics = "comment.deleted", groupId = "${spring.application.name}-group")
    public void commentDeleted(String message) {
        try {
            Long boardId = Long.parseLong(message);
            boardCountService.decrementCommentCount(boardId);
            log.info("댓글 수 감소 boardId={}", boardId);
        } catch (Exception e) {
            log.error("댓글 삭제 이벤트 처리 실패", e);
        }
    }
}
