package backend.service.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HealthCheckController {

    private final Environment env;

    // 상태 체크
    @GetMapping("/health-check")
    public String status() {
        return String.format("Port(local.server.port) = " + env.getProperty("local.server.port") +
                ", Port(server.port) = " + env.getProperty("server.port") +
                ", Test = " + env.getProperty("greeting.message")+
                ", Secret= "+env.getProperty("token.secret")

        );
    }
}
