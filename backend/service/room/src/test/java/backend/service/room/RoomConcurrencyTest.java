package backend.service.room;

import backend.service.room.entity.RoomEntity;
import backend.service.room.repository.RoomRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;

import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootTest(classes = RoomApplication.class)
@Import(TestContainersConfig.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestPropertySource(properties = {
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "spring.config.import=optional:configserver:"
})
class RoomConcurrencyTest {

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainersConfig.mysql::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainersConfig.mysql::getUsername);
        registry.add("spring.datasource.password", TestContainersConfig.mysql::getPassword);
        registry.add("spring.data.redis.host", TestContainersConfig.redis::getHost);
        registry.add("spring.data.redis.port", TestContainersConfig.redis::getFirstMappedPort);
    }

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private static long dbResult;
    private static long dbTime;
    private static long redisResult;
    private static long redisTime;
    private static int redisFailCount;

    private Long roomId = 1L;

    @BeforeEach
    void setUp() {
        stringRedisTemplate.getConnectionFactory().getConnection().flushAll();
        roomRepository.deleteAll();

        RoomEntity room = RoomEntity.create(
                1L,
                "테스트룸",
                1L,
                false,
                null,
                "testcode"
        );
        roomRepository.save(room);

        // 생성자 Redis에 추가
        stringRedisTemplate.opsForSet().add("room:participants:" + roomId, "1");
        stringRedisTemplate.opsForValue().set("user:room:1", String.valueOf(roomId));
    }

    @Test
    @Order(1)
    @DisplayName("1. DB 직접 업데이트 - 방 인원 제한 동시성 문제")
    void withoutRedis() throws InterruptedException {
        int threadCount = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        CountDownLatch latch = new CountDownLatch(threadCount);

        long start = System.currentTimeMillis();
        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    RoomEntity room = roomRepository.findById(roomId).orElseThrow();
                    if (room.getCurrentPeople() < room.getMaxPeople()) {
                        room.enter();
                        roomRepository.save(room);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        executorService.shutdown();
        long end = System.currentTimeMillis();

        dbResult = roomRepository.findById(roomId).orElseThrow().getCurrentPeople();
        dbTime = end - start;

        System.out.println("=== DB 직접 업데이트 ===");
        System.out.println("최대 인원: 4명 (생성자 1명 포함)");
        System.out.println("추가 입장 시도: " + threadCount + "명");
        System.out.println("실제 입장: " + dbResult + "명 (생성자 포함)");
        System.out.println("미달 입장: " + Math.max(0, 4 - dbResult) + "명 (동시성 문제로 유실)");
        System.out.println("소요 시간: " + dbTime + "ms");
    }

    @Test
    @Order(2)
    @DisplayName("2. Redis 사용 - 방 인원 제한 동시성 테스트")
    void withRedis() throws InterruptedException {
        int threadCount = 10;
        int maxPeople = 4;
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        String luaScript =
                "local current = redis.call('SCARD', KEYS[1]) " +
                        "if current < tonumber(ARGV[1]) then " +
                        "  redis.call('SADD', KEYS[1], ARGV[2]) " +
                        "  return 1 " +
                        "else " +
                        "  return 0 " +
                        "end";

        DefaultRedisScript<Long> script = new DefaultRedisScript<>(luaScript, Long.class);

        long start = System.currentTimeMillis();
        for (int i = 0; i < threadCount; i++) {
            final long userId = i + 2; // 생성자(1) 제외
            executorService.submit(() -> {
                try {
                    Long result = stringRedisTemplate.execute(
                            script,
                            Collections.singletonList("room:participants:" + roomId),
                            String.valueOf(maxPeople),
                            String.valueOf(userId)
                    );

                    if (result != null && result == 1L) {
                        stringRedisTemplate.opsForValue().set("user:room:" + userId, String.valueOf(roomId));
                        RoomEntity room = roomRepository.findById(roomId).orElseThrow();
                        room.enter();
                        roomRepository.save(room);
                        successCount.incrementAndGet();
                    } else {
                        failCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        executorService.shutdown();
        long end = System.currentTimeMillis();

        redisResult = stringRedisTemplate.opsForSet().size("room:participants:" + roomId);
        redisTime = end - start;
        redisFailCount = failCount.get();

        System.out.println("\n=== Redis 사용 ===");
        System.out.println("최대 인원: 4명 (생성자 1명 포함)");
        System.out.println("추가 입장 시도: " + threadCount + "명");
        System.out.println("실제 입장: " + redisResult + "명 (생성자 포함)");
        System.out.println("입장 거부: " + redisFailCount + "명");
        System.out.println("소요 시간: " + redisTime + "ms");
    }

    @Test
    @Order(3)
    @DisplayName("3. DB vs Redis 비교")
    void compare() {
        System.out.println("\n=== DB vs Redis ===");
        System.out.println("DB 방식:    " + dbResult + "명 입장 (동시성 문제로 " + Math.max(0, 4 - dbResult) + "명 유실)");
        System.out.println("Redis 방식: " + redisResult + "명 입장 (정확히 최대 인원 제한)");
        System.out.println("입장 거부:  DB는 인원 유실 발생, Redis는 정확히 " + redisFailCount + "명 거부");
        System.out.println("소요시간:   Redis가 " + String.format("%.1f", (double) dbTime / redisTime) + "배 빠름 (" + dbTime + "ms → " + redisTime + "ms)");
    }
}
/*
=== DB 직접 업데이트 ===
최대 인원: 4명 (생성자 1명 포함)
추가 입장 시도: 10명
실제 입장: 2명 (생성자 포함)
미달 입장: 2명 (동시성 문제로 유실)
소요 시간: 39ms

=== Redis 사용 ===
최대 인원: 4명 (생성자 1명 포함)
추가 입장 시도: 10명
실제 입장: 4명 (생성자 포함)
입장 거부: 7명
소요 시간: 39ms

=== DB vs Redis ===
DB 방식:    2명 입장 (동시성 문제로 2명 유실)
Redis 방식: 4명 입장 (정확히 최대 인원 제한)
입장 거부:  DB는 인원 유실 발생, Redis는 정확히 7명 거부
소요시간:   Redis가 1.0배 빠름 (39ms → 39ms)
 */