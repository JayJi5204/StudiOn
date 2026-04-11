package backend.service.comment.kafka.consumer.board;

import backend.common.dto.board.BoardDeleteEvent;
import backend.service.comment.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class BoardDeleteConsumer {

    private final CommentRepository commentRepository;

    @KafkaListener(topics = "board.deleted")
    @Transactional
    public void deleteBoard(BoardDeleteEvent event) {
        commentRepository.deleteByBoardId(event.boardId());
        log.info("다음 번호의 게시글이 삭제되었습니다. boardId={}", event.boardId());
    }
}