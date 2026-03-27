package backend.service.board.util;

import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardCountSyncScheduler {

    private final BoardRepository boardRepository;
    private final BoardCountService boardCountService;

    @Scheduled(fixedDelay = 60000) // 1분마다
    public void syncCountsToDB() {
        log.info("Board count DB 동기화 시작");

        List<BoardEntity> boards = boardRepository.findAll();

        for (BoardEntity board : boards) {
            Long viewCount = boardCountService.getViewCount(board.getBoardId());
            Long likeCount = boardCountService.getLikeCount(board.getBoardId());
            board.syncCounts(viewCount, likeCount);
            boardRepository.save(board);
        }

        log.info("Board count DB 동기화 완료");
    }
}