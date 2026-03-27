package backend.service.board.util;

import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardCountInitializer implements ApplicationRunner {

    private final BoardRepository boardRepository;
    private final BoardCountService boardCountService;
    private final RedisTemplate<String, Long> redisTemplate;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Board count Redis 초기화 시작");

        List<BoardEntity> boards = boardRepository.findAll();

        for (BoardEntity board : boards) {
            String viewKey = "board:view:" + board.getBoardId();
            String likeKey = "board:like:" + board.getBoardId();

            // Redis에 없을 때만 DB 값으로 초기화
            if (Boolean.FALSE.equals(redisTemplate.hasKey(viewKey))) {
                redisTemplate.opsForValue().set(viewKey, board.getViewCount());
            }
            if (Boolean.FALSE.equals(redisTemplate.hasKey(likeKey))) {
                redisTemplate.opsForValue().set(likeKey, board.getLikeCount());
            }
        }

        log.info("Board count Redis 초기화 완료");
    }
}