package backend.service.room;

import backend.common.kafkaEvent.KafkaProducer;
import com.redis.testcontainers.RedisContainer;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
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

    @Bean
    @Primary
    public KafkaProducer kafkaProducer() {
        return Mockito.mock(KafkaProducer.class);
    }
}