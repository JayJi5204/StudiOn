package backend.service.user.controller;

import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import backend.service.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public CreateResponse create(@RequestBody CreateRequest dto) {
        return userService.create(dto);
    }

    @GetMapping("/get")
    public List<CreateResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/get/{userId}")
    public GetUserResponse getUser(@PathVariable("userId") Long userId) {
        return userService.getUser(userId);
    }

    @DeleteMapping("/delete/{userId}")
    public DeletedResponse delete(@PathVariable("userId") Long userId, @RequestBody DeleteRequest dto) {
        return userService.delete(dto, userId);
    }

    @PutMapping("/update/{userId}")
    public UpdateResponse update(@PathVariable("userId") Long userId, @RequestBody UpdateRequest dto) {
        return userService.update(dto, userId);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest dto, HttpServletResponse response) {
        return userService.login(dto,response);
    }
}
