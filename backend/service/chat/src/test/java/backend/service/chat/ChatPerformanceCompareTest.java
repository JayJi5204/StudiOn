package backend.service.chat;

import backend.common.id.Snowflake;
import backend.service.chat.dto.response.CreateResponse;
import backend.service.chat.entity.ChatEntity;
import backend.service.chat.repository.ChatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@SpringBootTest(classes = ChatApplication.class)
@Import(TestContainersConfig.class)
@TestPropertySource(properties = {
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "spring.config.import=optional:configserver:"
})
class ChatPerformanceCompareTest {

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainersConfig.mysql::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainersConfig.mysql::getUsername);
        registry.add("spring.datasource.password", TestContainersConfig.mysql::getPassword);
        registry.add("spring.data.redis.host", TestContainersConfig.redis::getHost);
        registry.add("spring.data.redis.port", TestContainersConfig.redis::getFirstMappedPort);
    }

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String ROOM_ID = "room-test-001";
    private static final String CHAT_TOPIC = "chat:room:";
    private static final int THREAD_COUNT = 100;
    private static final int POOL_SIZE = 32;
    private final Snowflake snowflake = new Snowflake();

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        chatRepository.deleteAll();
    }

    @Test
    @DisplayName("Redis 없이 DB 직접 저장 - 속도 측정")
    void withoutRedis() throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(POOL_SIZE);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        List<Long> latencies = Collections.synchronizedList(new ArrayList<>());

        long start = System.currentTimeMillis();

        for (int i = 0; i < THREAD_COUNT; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    long t0 = System.currentTimeMillis();

                    ChatEntity entity = ChatEntity.create(
                            snowflake.nextId(), ROOM_ID, (long) idx, "user" + idx, "message" + idx
                    );
                    chatRepository.save(entity); // DB 직접 저장

                    latencies.add(System.currentTimeMillis() - t0);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();
        long totalTime = System.currentTimeMillis() - start;

        System.out.println("=== Redis 없이 DB 직접 저장 ===");
        printResult(totalTime, latencies);
    }

    @Test
    @DisplayName("Redis Pub/Sub 발행 - 속도 측정")
    void withRedis() throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(POOL_SIZE);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        List<Long> latencies = Collections.synchronizedList(new ArrayList<>());

        long start = System.currentTimeMillis();

        for (int i = 0; i < THREAD_COUNT; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    long t0 = System.currentTimeMillis();

                    ChatEntity entity = ChatEntity.create(
                            snowflake.nextId(), ROOM_ID, (long) idx, "user" + idx, "message" + idx
                    );
                    CreateResponse response = CreateResponse.from(entity);
                    redisTemplate.convertAndSend(CHAT_TOPIC + ROOM_ID, response); // Redis Pub/Sub 발행

                    latencies.add(System.currentTimeMillis() - t0);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();
        long totalTime = System.currentTimeMillis() - start;

        System.out.println("=== Redis Pub/Sub 발행 ===");
        printResult(totalTime, latencies);
    }

    private void printResult(long totalTime, List<Long> latencies) {
        Collections.sort(latencies);
        double avg = latencies.stream().mapToLong(l -> l).average().orElse(0);
        long p50 = latencies.get((int) (latencies.size() * 0.50));
        long p95 = latencies.get((int) (latencies.size() * 0.95));
        long p99 = latencies.get((int) (latencies.size() * 0.99));
        long max  = latencies.get(latencies.size() - 1);
        double tps = (double) THREAD_COUNT / totalTime * 1000;

        System.out.printf("  Avg: %.1fms | P50: %dms | P95: %dms | P99: %dms | Max: %dms%n",
                avg, p50, p95, p99, max);
        System.out.println("  총 소요 시간: " + totalTime + "ms");
        System.out.printf("  TPS: %.0f건/초%n%n", tps);
    }
}
/*
=== Redis 없이 DB 직접 저장 ===
  Avg: 31.4ms | P50: 20ms | P95: 76ms | P99: 96ms | Max: 96ms
  총 소요 시간: 107ms
  TPS: 935건/초
=== Redis Pub/Sub 발행 ===
  Avg: 8.3ms | P50: 2ms | P95: 22ms | P99: 24ms | Max: 24ms
  총 소요 시간: 29ms
  TPS: 3448건/초

=== DB vs Redis ===
평균 응답속도: Redis가 3.8배 빠름 (31.4ms → 8.3ms)
중간값(P50): Redis가 10배 빠름 (20ms → 2ms)  ← 가장 임팩트 있는 수치
TPS: Redis가 3.7배 높음 (935 → 3,448)
총 처리시간: Redis가 3.7배 빠름 (107ms → 29ms)
 */