package backend.service.groupChat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication(scanBasePackages = {"backend.service.groupChat", "backend.common"})
@EnableDiscoveryClient
@EnableFeignClients
public class GroupChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(GroupChatApplication.class);
    }

}
