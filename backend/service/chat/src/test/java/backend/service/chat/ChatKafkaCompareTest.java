package backend.service.chat;

import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
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

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(classes = ChatApplication.class)
@Import(TestContainersConfig.class)
@TestPropertySource(properties = {
        "spring.cloud.config.enabled=false",
        "spring.cloud.config.import-check.enabled=false",
        "spring.config.import=optional:configserver:"
})
class ChatKafkaCompareTest {

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainersConfig.mysql::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainersConfig.mysql::getUsername);
        registry.add("spring.datasource.password", TestContainersConfig.mysql::getPassword);
        registry.add("spring.data.redis.host", TestContainersConfig.redis::getHost);
        registry.add("spring.data.redis.port", TestContainersConfig.redis::getFirstMappedPort);
        registry.add("spring.kafka.bootstrap-servers", TestContainersConfig.kafka::getBootstrapServers);
    }

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private KafkaProducer kafkaProducer;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String ROOM_ID = "room-kafka-test";
    private static final int MESSAGE_COUNT = 100;
    private static final int POOL_SIZE = 32;
    private final Snowflake snowflake = new Snowflake();

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
        chatRepository.deleteAll();
    }

    @Test
    @DisplayName("Kafka 없이 Redis Pub/Sub만 사용 - 메시지 유실 확인")
    void withoutKafka() throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(POOL_SIZE);
        CountDownLatch latch = new CountDownLatch(MESSAGE_COUNT);

        long start = System.currentTimeMillis();

        for (int i = 0; i < MESSAGE_COUNT; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    ChatEntity entity = ChatEntity.create(
                            snowflake.nextId(), ROOM_ID, (long) idx, "user" + idx, "message" + idx
                    );
                    // Redis Pub/Sub만 발행 → Kafka produce 없음 → DB 저장 안됨
                    redisTemplate.convertAndSend("chat:room:" + ROOM_ID, CreateResponse.from(entity));
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();
        long totalTime = System.currentTimeMillis() - start;

        // Redis Pub/Sub은 비동기라 구독자가 받아도 DB 저장 로직이 없음
        long savedCount = chatRepository.countByRoomId(ROOM_ID);

        System.out.println("=== Kafka 없이 Redis Pub/Sub만 ===");
        System.out.println("발행 메시지: " + MESSAGE_COUNT);
        System.out.println("DB 저장 건수: " + savedCount);
        System.out.println("유실 건수: " + (MESSAGE_COUNT - savedCount));
        System.out.printf("유실률: %.0f%%%n", (double)(MESSAGE_COUNT - savedCount) / MESSAGE_COUNT * 100);
        System.out.println("소요 시간: " + totalTime + "ms");
    }

    @Test
    @DisplayName("Kafka 사용 - 메시지 영속성 보장 확인")
    void withKafka() throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(POOL_SIZE);
        CountDownLatch latch = new CountDownLatch(MESSAGE_COUNT);

        long start = System.currentTimeMillis();

        for (int i = 0; i < MESSAGE_COUNT; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    ChatEntity entity = ChatEntity.create(
                            snowflake.nextId(), ROOM_ID, (long) idx, "user" + idx, "message" + idx
                    );
                    // Kafka produce → ChatSaveConsumer가 consume → DB 저장
                    kafkaProducer.send("chat.message", entity);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executor.shutdown();
        long produceTime = System.currentTimeMillis() - start;

        // ChatSaveConsumer가 consume해서 DB에 저장할 때까지 대기
        long savedCount = 0;
        long waitStart = System.currentTimeMillis();
        while (System.currentTimeMillis() - waitStart < 10_000) { // 최대 10초 대기
            savedCount = chatRepository.countByRoomId(ROOM_ID);
            if (savedCount >= MESSAGE_COUNT) break;
            Thread.sleep(200);
        }
        long totalTime = System.currentTimeMillis() - start;

        System.out.println("=== Kafka 사용 ===");
        System.out.println("발행 메시지: " + MESSAGE_COUNT);
        System.out.println("DB 저장 건수: " + savedCount);
        System.out.println("유실 건수: " + (MESSAGE_COUNT - savedCount));
        System.out.printf("유실률: %.0f%%%n", (double)(MESSAGE_COUNT - savedCount) / MESSAGE_COUNT * 100);
        System.out.println("Produce 소요 시간: " + produceTime + "ms");
        System.out.println("전체 소요 시간 (consume 포함): " + totalTime + "ms");

        assertEquals(MESSAGE_COUNT, savedCount, "Kafka 사용 시 모든 메시지가 DB에 저장되어야 함");
    }
    @Test
    @DisplayName("장애 복구 - Kafka offset 기반 재처리 vs Redis Pub/Sub 유실")
    void failureRecoveryTest() throws InterruptedException {
        int totalMessages = 50;
        Snowflake snowflake = new Snowflake();

        // consumer 없는 상태에서 발행 (장애 상황 시뮬레이션)
        for (int i = 0; i < totalMessages; i++) {
            ChatEntity entity = ChatEntity.create(
                    snowflake.nextId(), ROOM_ID + "-redis", (long) i, "user" + i, "message" + i
            );
            redisTemplate.convertAndSend("chat:room:" + ROOM_ID + "-redis", CreateResponse.from(entity));
        }

        Thread.sleep(500);
        long redisSaved = chatRepository.countByRoomId(ROOM_ID + "-redis");

        System.out.println("=== Redis Pub/Sub - 장애 복구 ===");
        System.out.println("발행 메시지: " + totalMessages);
        System.out.println("DB 저장 건수: " + redisSaved);
        System.out.println("유실 건수: " + (totalMessages - redisSaved));
        System.out.println("→ consumer 재시작해도 유실된 메시지 복구 불가");


        long start = System.currentTimeMillis();

        // 1차 발행
        for (int i = 0; i < totalMessages; i++) {
            ChatEntity entity = ChatEntity.create(
                    snowflake.nextId(), ROOM_ID + "-kafka", (long) i, "user" + i, "1차-message" + i
            );
            kafkaProducer.send("chat.message", entity);
        }

        Thread.sleep(100);

        for (int i = 0; i < totalMessages; i++) {
            ChatEntity entity = ChatEntity.create(
                    snowflake.nextId(), ROOM_ID + "-kafka", (long) i + totalMessages, "user" + i, "2차-message" + i
            );
            kafkaProducer.send("chat.message", entity);
        }


        long kafkaSaved = 0;
        long waitStart = System.currentTimeMillis();
        while (System.currentTimeMillis() - waitStart < 15_000) {
            kafkaSaved = chatRepository.countByRoomId(ROOM_ID + "-kafka");
            if (kafkaSaved >= totalMessages * 2) break;
            Thread.sleep(200);
        }
        long totalTime = System.currentTimeMillis() - start;

        System.out.println("\n=== Kafka - 장애 복구 ===");
        System.out.println("발행 메시지: " + totalMessages * 2 + " (1차 50건 + 2차 50건)");
        System.out.println("DB 저장 건수: " + kafkaSaved);
        System.out.println("유실 건수: " + (totalMessages * 2 - kafkaSaved));
        System.out.println("전체 처리 시간: " + totalTime + "ms");
        System.out.println("→ 부하 상황에서도 offset 기반으로 모든 메시지 순차 처리");


        System.out.println("\n========== 장애 복구 비교 ==========");
        System.out.println("Redis Pub/Sub: " + redisSaved + "/" + totalMessages + "건 저장 (유실률 " + (100 - redisSaved * 100 / totalMessages) + "%)");
        System.out.println("Kafka:         " + kafkaSaved + "/" + (totalMessages * 2) + "건 저장 (유실률 " + (totalMessages * 2 - kafkaSaved) * 100 / (totalMessages * 2) + "%)");
        System.out.println("=====================================");

        assertEquals(totalMessages * 2, kafkaSaved, "Kafka는 부하 상황에서도 모든 메시지를 저장해야 함");
    }
}

/*
=== Kafka 없이 Redis Pub/Sub만 ===
발행 메시지: 100
DB 저장 건수: 0
유실 건수: 100
유실률: 100%
소요 시간: 28ms

=== Kafka 사용 ===
발행 메시지: 100
DB 저장 건수: 100
유실 건수: 0
유실률: 0%
Produce 소요 시간: 56ms
전체 소요 시간 (consume 포함): 668ms


=== Redis Pub/Sub - 장애 복구 ===
발행 메시지: 50
DB 저장 건수: 0
유실 건수: 50

=== Kafka - 장애 복구 ===
발행 메시지: 100 (1차 50건 + 2차 50건)
DB 저장 건수: 100
유실 건수: 0
전체 처리 시간: 560ms
→ 부하 상황에서도 offset 기반으로 모든 메시지 순차 처리

========== 장애 복구 비교 ==========
Redis Pub/Sub: 0/50건 저장 (유실률 100%)
Kafka:         100/100건 저장 (유실률 0%)
=====================================

 */


