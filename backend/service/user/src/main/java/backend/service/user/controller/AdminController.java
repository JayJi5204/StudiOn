package backend.service.user.controller;

import backend.service.user.dto.response.GetUserResponse;
import backend.service.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "Admin", description = "관리자 관리 API")
@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    @Operation(summary = "관리자를 이용한 특정 사용자 조회", description = "ID를 통해 특정 사용자의 정보를 조회합니다.")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{userId}")
    public GetUserResponse getUserByAdmin(
            @Parameter(description = "조회할 사용자의 ID", example = "279294608354758660")
            @PathVariable Long userId) {
        return userService.getUserByAdmin(userId);
    }
}
