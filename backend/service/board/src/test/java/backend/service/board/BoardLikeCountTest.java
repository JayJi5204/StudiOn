package backend.service.board;

import backend.common.enumType.Category;
import backend.common.exception.CustomException;
import backend.service.board.entity.BoardEntity;
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
import java.util.concurrent.atomic.AtomicInteger;

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

        BoardEntity board = BoardEntity.create(
                1L,
                1L,
                "테스터",
                "테스트 게시글",
                "내용",
                Category.COMMUNITY,
                null
        );
        boardRepository.save(board);
        boardId = 1L;
    }

    @Test
    @DisplayName("DB 직접 업데이트 - 좋아요 동시성 문제 발생")
    void withoutRedis() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);

        long start = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            final long userId = i + 1;
            executorService.submit(() -> {
                try {
                    // DB에서 직접 읽고 업데이트
                    BoardEntity board = boardRepository.findById(boardId).orElseThrow();
                    // 중복 체크 없이 바로 likeCount 증가
                    board.syncCounts(board.getViewCount(), board.getLikeCount() + 1);
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

        System.out.println("=== Redis 없이 DB 직접 업데이트 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + result.getLikeCount());
        System.out.println("유실 개수: " + (100 - result.getLikeCount()));
        System.out.println("유실률: " + (100 - result.getLikeCount()) + "%");
        System.out.println("소요 시간: " + (end - start) + "ms");
    }

    @Test
    @DisplayName("Redis Set + INCR - 좋아요 동시성 테스트")
    void withRedis() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger duplicateCount = new AtomicInteger(0);

        long start = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            final long userId = i + 1;
            executorService.submit(() -> {
                try {
                    boardCountService.like(boardId, userId);
                    successCount.incrementAndGet();
                } catch (CustomException e) {
                    duplicateCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        long end = System.currentTimeMillis();
        Long likeCount = boardCountService.getLikeCount(boardId);

        System.out.println("=== Redis 사용 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + likeCount);
        System.out.println("성공 건수: " + successCount.get());
        System.out.println("중복 방지 건수: " + duplicateCount.get());
        System.out.println("유실 건수: " + (100 - likeCount));
        System.out.println("소요 시간: " + (end - start) + "ms");

        assertEquals(100L, likeCount);
    }

    @Test
    @DisplayName("DB vs Redis 좋아요 성능 비교")
    void comparePerformance() throws InterruptedException {
        // DB 테스트
        int threadCount = 100;
        ExecutorService executorService1 = Executors.newFixedThreadPool(32);
        CountDownLatch latch1 = new CountDownLatch(threadCount);

        long dbStart = System.currentTimeMillis();
        for (int i = 0; i < threadCount; i++) {
            executorService1.submit(() -> {
                try {
                    BoardEntity board = boardRepository.findById(boardId).orElseThrow();
                    board.syncCounts(board.getViewCount(), board.getLikeCount() + 1);
                    boardRepository.save(board);
                } finally {
                    latch1.countDown();
                }
            });
        }
        latch1.await();
        executorService1.shutdown();
        long dbEnd = System.currentTimeMillis();
        long dbResult = boardRepository.findById(boardId).orElseThrow().getLikeCount();

        // Redis 초기화
        redisTemplate.getConnectionFactory().getConnection().flushAll();

        // Redis 테스트
        ExecutorService executorService2 = Executors.newFixedThreadPool(32);
        CountDownLatch latch2 = new CountDownLatch(threadCount);

        long redisStart = System.currentTimeMillis();
        for (int i = 0; i < threadCount; i++) {
            final long userId = i + 1;
            executorService2.submit(() -> {
                try {
                    boardCountService.like(boardId, userId);
                } catch (Exception e) {
                } finally {
                    latch2.countDown();
                }
            });
        }
        latch2.await();
        executorService2.shutdown();
        long redisEnd = System.currentTimeMillis();
        Long redisResult = boardCountService.getLikeCount(boardId);

        System.out.println("\n========== 좋아요 DB vs Redis 비교 ==========");
        System.out.println("=== DB 직접 업데이트 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + dbResult);
        System.out.println("유실 건수: " + (100 - dbResult));
        System.out.println("유실률: " + (100 - dbResult) + "%");
        System.out.println("소요 시간: " + (dbEnd - dbStart) + "ms");

        System.out.println("\n=== Redis 사용 ===");
        System.out.println("예상 결과: 100");
        System.out.println("실제 결과: " + redisResult);
        System.out.println("유실 건수: " + (100 - redisResult));
        System.out.println("유실률: 0%");
        System.out.println("소요 시간: " + (redisEnd - redisStart) + "ms");

        System.out.println("\n=== 비교 결과 ===");
        System.out.println("정확도: Redis가 " + String.format("%.1f", (double) redisResult / dbResult) + "배 정확");
        System.out.println("소요시간: Redis가 " + String.format("%.1f", (double)(dbEnd - dbStart) / (redisEnd - redisStart)) + "배 빠름");
        System.out.println("=============================================");
    }
}
/*
========== 좋아요 DB vs Redis 비교 ==========
=== DB 직접 업데이트 ===
예상 결과: 100
실제 결과: 6
유실 건수: 94
유실률: 94%
소요 시간: 129ms

=== Redis 사용 ===
예상 결과: 100
실제 결과: 100
유실 건수: 0
유실률: 0%
소요 시간: 13ms

=== 비교 결과 ===
정확도: Redis가 16.7배 정확
소요시간: Redis가 9.9배 빠름
=============================================
 */