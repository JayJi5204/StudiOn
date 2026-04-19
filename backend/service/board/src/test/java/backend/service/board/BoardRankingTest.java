package backend.service.board;

import backend.common.enumType.Category;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardCountService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = BoardApplication.class)
@Import(TestContainersConfig.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestPropertySource(properties = {
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "spring.config.import=optional:configserver:"
})
class BoardRankingTest {

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
    private StringRedisTemplate stringRedisTemplate;

    private static long dbTime;
    private static long redisTime;
    private static final int BOARD_COUNT = 100;
    private static final int TOP = 10;
    private static final int REPEAT = 100;

    @BeforeEach
    void setUp() {
        stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
        boardRepository.deleteAll();

        for (int i = 1; i <= BOARD_COUNT; i++) {
            BoardEntity board = BoardEntity.create(
                    (long) i,
                    1L,
                    "테스터",
                    "테스트 게시글 " + i,
                    "내용 " + i,
                    Category.COMMUNITY,
                    null
            );
            board.syncCounts((long) (Math.random() * 1000), (long) (Math.random() * 500));
            boardRepository.save(board);

            stringRedisTemplate.opsForZSet().add(
                    "ranking:board:view",
                    String.valueOf(i),
                    board.getViewCount()
            );
            stringRedisTemplate.opsForZSet().add(
                    "ranking:board:like",
                    String.valueOf(i),
                    board.getLikeCount()
            );
        }
    }

    @Test
    @Order(1)
    @DisplayName("1. DB 직접 정렬 조회 - 조회수 TOP 10")
    void dbViewRanking() {
        long start = System.currentTimeMillis();

        for (int i = 0; i < REPEAT; i++) {
            boardRepository.findAll().stream()
                    .filter(b -> b.getCategory() != Category.NOTICE)
                    .sorted((a, b) -> Long.compare(b.getViewCount(), a.getViewCount()))
                    .limit(TOP)
                    .toList();
        }

        long end = System.currentTimeMillis();
        dbTime = end - start;

        System.out.println("=== DB 직접 정렬 조회 ===");
        System.out.println("게시글 수:     " + BOARD_COUNT + "개");
        System.out.println("TOP:           " + TOP + "개");
        System.out.println("조회 횟수:     " + REPEAT + "회");
        System.out.println("총 소요시간:   " + dbTime + "ms");
        System.out.println("평균 소요시간: " + String.format("%.2f", (double) dbTime / REPEAT) + "ms");
    }

    @Test
    @Order(2)
    @DisplayName("2. Redis Sorted Set 조회 - 조회수 TOP 10")
    void redisViewRanking() {
        long start = System.currentTimeMillis();

        for (int i = 0; i < REPEAT; i++) {
            stringRedisTemplate.opsForZSet()
                    .reverseRange("ranking:board:view", 0, TOP - 1);
        }

        long end = System.currentTimeMillis();
        redisTime = end - start;

        System.out.println("\n=== Redis Sorted Set 조회 ===");
        System.out.println("게시글 수:     " + BOARD_COUNT + "개");
        System.out.println("TOP:           " + TOP + "개");
        System.out.println("조회 횟수:     " + REPEAT + "회");
        System.out.println("총 소요시간:   " + redisTime + "ms");
        System.out.println("평균 소요시간: " + String.format("%.2f", (double) redisTime / REPEAT) + "ms");
    }

    @Test
    @Order(3)
    @DisplayName("3. DB vs Redis 랭킹 조회 비교")
    void compare() {
        System.out.println("\n=== DB vs Redis ===");
        System.out.println("총 소요시간:   DB " + dbTime + "ms → Redis " + redisTime + "ms");
        System.out.println("평균 소요시간: DB " + String.format("%.2f", (double) dbTime / REPEAT) + "ms → Redis " + String.format("%.2f", (double) redisTime / REPEAT) + "ms");
        System.out.println("속도:          Redis가 " + String.format("%.1f", (double) dbTime / redisTime) + "배 빠름");
        System.out.println("단축률:        " + String.format("%.1f", ((double)(dbTime - redisTime) / dbTime) * 100) + "% 단축");
    }
}

/*
=== DB 직접 정렬 조회 ===
게시글 수:     100개
TOP:           10개
조회 횟수:     100회
총 소요시간:   378ms
평균 소요시간: 3.78ms

=== Redis Sorted Set 조회 ===
게시글 수:     100개
TOP:           10개
조회 횟수:     100회
총 소요시간:   24ms
평균 소요시간: 0.24ms

=== DB vs Redis ===
총 소요시간:   DB 378ms → Redis 24ms
평균 소요시간: DB 3.78ms → Redis 0.24ms
속도:          Redis가 15.8배 빠름
단축률:        93.7% 단축
 */