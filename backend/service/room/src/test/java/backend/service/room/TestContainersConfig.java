package backend.service.room;

import com.redis.testcontainers.RedisContainer;
import org.springframework.boot.test.context.TestConfiguration;
import org.testcontainers.containers.MySQLContainer;

@TestConfiguration
public class TestContainersConfig {

    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    static final RedisContainer redis = new RedisContainer("redis:7");

    static {
        mysql.start();
        redis.start();
    }
}