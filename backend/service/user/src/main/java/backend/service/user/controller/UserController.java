package backend.service.user.controller;

import backend.service.user.dto.request.UserRequestDto;
import backend.service.user.dto.response.UserResponseDto;
import backend.service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final Environment env;

    // 상태 체크
    @GetMapping("/health-check")
    public String status() {
        return String.format("Port(local.server.port) = " + env.getProperty("local.server.port") + ", Port(server.port) = " + env.getProperty("server.port"));
    }

    @PostMapping("/users")
    public UserResponseDto createUser(@RequestBody UserRequestDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping("/users")
    public List<UserResponseDto> getUsers() {
        return userService.getUserByAll();
    }


    @GetMapping("/users/{userId}")
    public UserResponseDto findUser(@PathVariable("userId") String userId) {
        return userService.getUserByUserKey(userId);
    }
}
