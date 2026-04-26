package backend.service.board.util;

import backend.common.enumType.Category;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardInitializer implements ApplicationRunner {

    private final BoardRepository boardRepository;
    private final RedisTemplate<String, Long> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Board count Redis 초기화 시작");

        List<BoardEntity> boards = boardRepository.findAll();

        for (BoardEntity board : boards) {
            String viewKey = "board:view:" + board.getBoardId();
            String likeKey = "board:like:" + board.getBoardId();

            if (Boolean.FALSE.equals(redisTemplate.hasKey(viewKey))) {
                redisTemplate.opsForValue().set(viewKey, board.getViewCount());
            }
            if (Boolean.FALSE.equals(redisTemplate.hasKey(likeKey))) {
                redisTemplate.opsForValue().set(likeKey, board.getLikeCount());
            }

            // 랭킹 초기화 (NOTICE 제외)
            if (board.getCategory() != Category.NOTICE) {
                stringRedisTemplate.opsForZSet().add(
                        "ranking:board:view",
                        String.valueOf(board.getBoardId()),
                        board.getViewCount()
                );
                stringRedisTemplate.opsForZSet().add(
                        "ranking:board:like",
                        String.valueOf(board.getBoardId()),
                        board.getLikeCount()
                );
            }
        }

        log.info("Board count Redis 초기화 완료");
    }
}