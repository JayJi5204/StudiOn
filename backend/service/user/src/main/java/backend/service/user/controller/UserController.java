package backend.service.user.controller;

import backend.service.user.dto.request.CreateRequestDto;
import backend.service.user.dto.request.DeleteRequestDto;
import backend.service.user.dto.request.UpdateRequestDto;
import backend.service.user.dto.response.CreateResponseDto;
import backend.service.user.dto.response.DeletedResponseDto;
import backend.service.user.dto.response.UpdateResponseDto;
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
    public CreateResponseDto createUser(@RequestBody CreateRequestDto dto) {
        return userService.create(dto);
    }

    @GetMapping("/users")
    public List<CreateResponseDto> getUsers() {
        return userService.getUserByAll();
    }


    @GetMapping("/users/{userId}")
    public CreateResponseDto findUser(@PathVariable("userId") Long userId) {
        return userService.getUserByUserId(userId);
    }

    @PostMapping("/users/{userId}")
    public DeletedResponseDto delete(@PathVariable("userId") Long userId,@RequestBody DeleteRequestDto dto){
        return userService.delete(dto,userId);
    }

    @PutMapping("/users/{userId}")
    public UpdateResponseDto update(@PathVariable("userId") Long userId, @RequestBody UpdateRequestDto dto){
        return userService.update(dto,userId);
    }
}
