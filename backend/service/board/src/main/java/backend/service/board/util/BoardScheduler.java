package backend.service.board.util;

import backend.common.enumType.Category;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardScheduler {

    private final BoardRepository boardRepository;
    private final BoardCountService boardCountService;
    private final StringRedisTemplate stringRedisTemplate;

    @Scheduled(fixedDelay = 60000)
    public void syncCountsToDB() {
        log.info("Board count DB 동기화 시작");

        List<BoardEntity> boards = boardRepository.findAll();

        for (BoardEntity board : boards) {
            Long viewCount = boardCountService.getViewCount(board.getBoardId());
            Long likeCount = boardCountService.getLikeCount(board.getBoardId());
            board.syncCounts(viewCount, likeCount);
            boardRepository.save(board);

            // 랭킹 동기화 (NOTICE 제외)
            if (board.getCategory() != Category.NOTICE) {
                stringRedisTemplate.opsForZSet().add(
                        "ranking:board:view",
                        String.valueOf(board.getBoardId()),
                        viewCount
                );
                stringRedisTemplate.opsForZSet().add(
                        "ranking:board:like",
                        String.valueOf(board.getBoardId()),
                        likeCount
                );
            }
        }

        log.info("Board count DB 동기화 완료");
    }
}