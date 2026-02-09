package backend.service.user.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@Tag(name = "User HealthCheck",description = "User 통신 테스트")
@RestController
@RequiredArgsConstructor
public class HealthCheckController {

    private final Environment env;

    // 상태 체크
    @SecurityRequirements
    @GetMapping("/health-check")
    public String status() {
        return "User 통신 테스트 통과";

    }
}
