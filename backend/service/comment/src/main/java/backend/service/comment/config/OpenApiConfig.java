package backend.service.comment.config; // 각 서비스 패키지에 맞게 수정

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    // application.yml에 등록된 서비스 이름을 자동으로 가져옴 (예: user-service)
    @Value("${spring.application.name}")
    private String serviceName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(serviceName.toUpperCase() + " API")
                        .description(serviceName + " 마이크로서비스의 API 명세서입니다.")
                        .version("v1.0.0"))
                .servers(List.of(
                        new Server()
                                // 핵심: 모든 요청이 게이트웨이(8000)를 거치도록 주소 설정
                                .url("http://localhost:8000/" + serviceName)
                                .description("API Gateway Server")
                ));
    }
}