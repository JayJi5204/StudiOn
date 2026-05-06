package backend.service.room;

import backend.common.id.Snowflake;
import backend.service.room.entity.RoomEntity;
import backend.service.room.repository.RoomRepository;
import backend.service.room.service.RoomServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.List;
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
class RoomConcurrentLeaveTest {

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainersConfig.mysql::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainersConfig.mysql::getUsername);
        registry.add("spring.datasource.password", TestContainersConfig.mysql::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "com.mysql.cj.jdbc.Driver");
        registry.add("spring.data.redis.host", TestContainersConfig.redis::getHost);
        registry.add("spring.data.redis.port", () -> TestContainersConfig.redis.getMappedPort(6379));
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.kafka.bootstrap-servers", () -> "localhost:9092");
    }

    @Autowired
    private RoomServiceImpl roomService;

    @Autowired
    private RoomRepository roomRepository;

    private final Snowflake snowflake = new Snowflake();

    @Test
    @DisplayName("동시 퇴장 - 락 없는 경우 vs 락 있는 경우 비교")
    void concurrentLeave_WithAndWithoutLock_Comparison() throws InterruptedException {
        int maxPeople = 4;

        // === 락 없는 경우 ===
        Long roomIdNoLock = snowflake.nextId();
        RoomEntity roomNoLock = RoomEntity.create(roomIdNoLock, "락없는 테스트 방", 999L, false, null, "NOLOCK01");
        roomRepository.save(roomNoLock);

        List<Long> userIdsNoLock = new ArrayList<>();
        for (int i = 0; i < maxPeople; i++) {
            Long userId = snowflake.nextId();
            userIdsNoLock.add(userId);
            roomService.joinRoom(roomIdNoLock, userId);
        }

        long startNoLock = System.currentTimeMillis();
        ExecutorService executorNoLock = Executors.newFixedThreadPool(maxPeople);
        CountDownLatch latchNoLock = new CountDownLatch(maxPeople);
        AtomicInteger successNoLock = new AtomicInteger(0);
        AtomicInteger failNoLock = new AtomicInteger(0);

        for (Long userId : userIdsNoLock) {
            executorNoLock.submit(() -> {
                try {
                    roomService.leaveRoomWithoutLock(roomIdNoLock, userId);
                    successNoLock.incrementAndGet();
                } catch (Exception e) {
                    failNoLock.incrementAndGet();
                } finally {
                    latchNoLock.countDown();
                }
            });
        }
        latchNoLock.await();
        executorNoLock.shutdown();
        long timeNoLock = System.currentTimeMillis() - startNoLock;

        RoomEntity remainNoLock = roomRepository.findById(roomIdNoLock).orElse(null);
        boolean roomDeletedNoLock = remainNoLock == null;
        int remainPeopleNoLock = remainNoLock != null ? remainNoLock.getCurrentPeople() : 0;

        // === 락 있는 경우 ===
        Long roomIdLock = snowflake.nextId();
        RoomEntity roomLock = RoomEntity.create(roomIdLock, "락있는 테스트 방", 999L, false, null, "LOCK0001");
        roomRepository.save(roomLock);

        List<Long> userIdsLock = new ArrayList<>();
        for (int i = 0; i < maxPeople; i++) {
            Long userId = snowflake.nextId();
            userIdsLock.add(userId);
            roomService.joinRoom(roomIdLock, userId);
        }

        long startLock = System.currentTimeMillis();
        ExecutorService executorLock = Executors.newFixedThreadPool(maxPeople);
        CountDownLatch latchLock = new CountDownLatch(maxPeople);
        AtomicInteger successLock = new AtomicInteger(0);
        AtomicInteger failLock = new AtomicInteger(0);

        for (Long userId : userIdsLock) {
            executorLock.submit(() -> {
                try {
                    roomService.leaveRoom(roomIdLock, userId);
                    successLock.incrementAndGet();
                } catch (Exception e) {
                    failLock.incrementAndGet();
                } finally {
                    latchLock.countDown();
                }
            });
        }
        latchLock.await();
        executorLock.shutdown();
        long timeLock = System.currentTimeMillis() - startLock;

        RoomEntity remainLock = roomRepository.findById(roomIdLock).orElse(null);
        boolean roomDeletedLock = remainLock == null;
        int remainPeopleLock = remainLock != null ? remainLock.getCurrentPeople() : 0;

        System.out.println("""
                
                === 동시 퇴장 테스트 결과 ===
                총 퇴장 시도: %d회
                
                === 락 없는 경우 ===
                퇴장 호출 성공: %d회 (예외 없이 완료)
                퇴장 호출 실패: %d회
                실제 DB 반영: %d회 (%d회 유실)
                예상 남은 인원: 0명
                실제 남은 인원: %d명
                방 삭제 여부: %s
                소요 시간: %dms
                
                === 락 있는 경우 ===
                퇴장 호출 성공: %d회 (예외 없이 완료)
                퇴장 호출 실패: %d회
                실제 DB 반영: %d회 (%d회 유실)
                예상 남은 인원: 0명
                실제 남은 인원: %d명
                방 삭제 여부: %s
                소요 시간: %dms
                
                === 비교 ===
                락 없는 경우: 실제 남은 인원 %d명, 방 삭제 %s (동시성 문제 %s)
                락 있는 경우: 실제 남은 인원 %d명, 방 삭제 %s (동시성 문제 %s)
                소요 시간: 락 없는 경우 %dms → 락 있는 경우 %dms
                """.formatted(
                maxPeople,
                successNoLock.get(), failNoLock.get(),
                maxPeople - remainPeopleNoLock, remainPeopleNoLock,
                remainPeopleNoLock, roomDeletedNoLock ? "O" : "X",
                timeNoLock,
                successLock.get(), failLock.get(),
                maxPeople - remainPeopleLock, remainPeopleLock,
                remainPeopleLock, roomDeletedLock ? "O" : "X",
                timeLock,
                remainPeopleNoLock, roomDeletedNoLock ? "O" : "X", remainPeopleNoLock > 0 ? "발생" : "없음",
                remainPeopleLock, roomDeletedLock ? "O" : "X", remainPeopleLock > 0 ? "발생" : "없음",
                timeNoLock, timeLock
        ));
    }
}

/*
=== 락 없는 경우 ===
퇴장 호출 성공: 4회 (예외 없이 완료)
퇴장 호출 실패: 0회
실제 DB 반영: 1회 (3회 유실)
예상 남은 인원: 0명
실제 남은 인원: 3명
방 삭제 여부: X
소요 시간: 19ms

=== 락 있는 경우 ===
퇴장 호출 성공: 4회 (예외 없이 완료)
퇴장 호출 실패: 0회
실제 DB 반영: 4회 (0회 유실)
예상 남은 인원: 0명
실제 남은 인원: 0명
방 삭제 여부: O
소요 시간: 59ms

=== 비교 ===
락 없는 경우: 실제 남은 인원 3명, 방 삭제 X (동시성 문제 발생)
락 있는 경우: 실제 남은 인원 0명, 방 삭제 O (동시성 문제 없음)
 */