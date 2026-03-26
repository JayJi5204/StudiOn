package backend.service.user.controller;

import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import backend.service.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User", description = "사용자 관리 API")
@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원 가입", description = "사용자의 정보를 받아 회원가입을 합니다.")
    @SecurityRequirements
    @PostMapping("/create")
    public CreateResponse create(@RequestBody CreateRequest dto) {
        return userService.create(dto);
    }

    @Operation(summary = "로그인", description = "email과 비밀번호를 이용하여 로그인을 합니다.")
    @SecurityRequirements
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest dto, HttpServletResponse response) {
        return userService.login(dto, response);
    }

    @Operation(summary = "전체 사용자 조회", description = "등록된 모든 사용자 목록을 가져옵니다.")
    @GetMapping("/get")
    public List<CreateResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(summary = "내 정보 조회", description = "사용자의 정보를 조회합니다.")
    @GetMapping("/myInfo")
    public GetMyInfoResponse getMyInfo() {
        return userService.getMyInfo();
    }

    @Operation(summary = "특정 사용자 조회", description = "ID를 통해 특정 사용자의 정보를 조회합니다.")
    @GetMapping("/{userId}")
    public GetUserResponse getUser(
            @Parameter(description = "조회할 사용자의 ID", example = "279294608354758660")
            @PathVariable Long userId){
        return userService.getUser(userId);
    }

    @Operation(summary = "회원 정보 수정", description = "기존 사용자의 정보를 업데이트합니다.")
    @PutMapping("/update")
    public UpdateResponse update(@RequestBody UpdateRequest dto) {
        return userService.update(dto);
    }

    @Operation(summary = "회원 탈퇴", description = "사용자 계정을 삭제합니다.")
    @DeleteMapping("/delete")
    public DeletedResponse delete() {
        return userService.delete();
    }

    @Operation(summary = "로그아웃", description = "로그아웃을 합니다.")
    @PostMapping("/logout")
    public LogoutResponse logout(HttpServletResponse response) {
        return userService.logout(response);
    }

    @Operation(summary = "토큰 재발급", description = "refreshToken을 이용하여 accessToken을 재발급합니다.")
    @SecurityRequirements
    @PostMapping("/reissue")
    public void reissue(HttpServletRequest request, HttpServletResponse response) {
        userService.reissue(request, response);
    }
}