package backend.service.room;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = {"backend.service.room", "backend.common"})
@EnableJpaAuditing
@EnableDiscoveryClient
@EnableFeignClients
public class RoomApplication {
    public static void main(String[] args) {
        SpringApplication.run(RoomApplication.class);
    }

}
