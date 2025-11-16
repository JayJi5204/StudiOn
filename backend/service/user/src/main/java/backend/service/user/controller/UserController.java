package backend.service.user.controller;

import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.CreateResponse;
import backend.service.user.dto.response.DeletedResponse;
import backend.service.user.dto.response.UpdateResponse;
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
    public CreateResponse createUser(@RequestBody CreateRequest dto) {
        return userService.create(dto);
    }

    @GetMapping("/users")
    public List<CreateResponse> getUsers() {
        return userService.getUserByAll();
    }


    @GetMapping("/users/{userId}")
    public CreateResponse findUser(@PathVariable("userId") Long userId) {
        return userService.getUserByUserId(userId);
    }

    @PostMapping("/users/{userId}")
    public DeletedResponse delete(@PathVariable("userId") Long userId, @RequestBody DeleteRequest dto){
        return userService.delete(dto,userId);
    }

    @PutMapping("/users/{userId}")
    public UpdateResponse update(@PathVariable("userId") Long userId, @RequestBody UpdateRequest dto){
        return userService.update(dto,userId);
    }
}
