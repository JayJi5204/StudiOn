package backend.service.board;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardCountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest(classes = BoardApplication.class)
@Import(TestContainersConfig.class)
@TestPropertySource(properties = {
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "spring.config.import=optional:configserver:"
})
class BoardLikeCountTest {

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainersConfig.mysql::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainersConfig.mysql::getUsername);
        registry.add("spring.datasource.password", TestContainersConfig.mysql::getPassword);
        registry.add("spring.data.redis.host", TestContainersConfig.redis::getHost);
        registry.add("spring.data.redis.port", TestContainersConfig.redis::getFirstMappedPort);
    }



    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardCountService boardCountService;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private Long boardId;

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();

        // boardId 직접 지정 (GeneratedValue 없으므로)
        BoardEntity board = BoardEntity.create(
                1L,        // boardId
                1L,        // userId
                "테스터",   // nickName
                "테스트 게시글", // title
                "내용",     // content
                Category.COMMUNITY, // category (실제 enum값으로 변경)
                null       // tags
        );
        boardRepository.save(board);
        boardId = 1L;
    }

    @Test
    @DisplayName("Redis 없이 DB 직접 업데이트 - Race Condition 발생")
    void withoutRedis() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);

        long start = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    // viewCount를 직접 read → update → save
                    BoardEntity board = boardRepository.findById(boardId).orElseThrow();
                    board.syncCounts(board.getViewCount() + 1, board.getLikeCount());
                    boardRepository.save(board);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        long end = System.currentTimeMillis();
        BoardEntity result = boardRepository.findById(boardId).orElseThrow();

        System.out.println("=== Redis 없이 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + result.getViewCount());
        System.out.println("유실 개수: " + (100 - result.getViewCount()));
        System.out.println("소요 시간: " + (end - start) + "ms");
    }

    @Test
    @DisplayName("Redis INCR 사용 - 조회수 동시성 테스트")
    void withRedis() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);

        long start = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    boardCountService.incrementViewCount(boardId); // 수정
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        long end = System.currentTimeMillis();
        Long result = boardCountService.getViewCount(boardId); // 수정

        System.out.println("=== Redis 사용 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + result);
        System.out.println("소요 시간: " + (end - start) + "ms");

        assertEquals(100L, result);
    }
}


/*
=== Redis 없이 ===
예상 결과: 100
실제 결과: 8
유실 개수: 92
소요 시간: 117ms
=== Redis 사용 ===
예상 결과: 100
실제 결과: 100
소요 시간: 10ms

=== DB vs Redis ===
정확도:    Redis가 12.5배 정확 (8% → 100%)
유실률:    DB는 92% 유실, Redis는 0% 유실
소요시간:  Redis가 11.7배 빠름 (117ms → 10ms)
 */