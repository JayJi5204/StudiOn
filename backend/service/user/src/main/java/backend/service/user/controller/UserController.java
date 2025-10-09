package backend.service.user.controller;

import backend.service.user.dto.request.UserRequestDto;
import backend.service.user.dto.response.UserResponseDto;
import backend.service.user.entity.UserEntity;
import backend.service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
@Log4j2
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    private final Environment env;

    // 상태 체크
    @GetMapping("/health-check") // http://localhost:60000/health-check
    public String status() {
        return String.format("Port(local.server.port) = " + env.getProperty("local.server.port") +
                ", Port(server.port) = " + env.getProperty("server.port")
        );
    }

    @GetMapping("/test")
    public String test(){
        return "Test Ok";
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto dto) {

        UserRequestDto userRequestDto = userService.createUser(dto);

        UserResponseDto userResponseDto = UserResponseDto.builder()
                .userId(userRequestDto.getUserId())
                .userName(userRequestDto.getUserName())
                .email(userRequestDto.getEmail())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getUsers() {
        List<UserEntity> userEntities = userService.getUserByAll();

        List<UserResponseDto> responseDtoList = userEntities.stream()
                .map(userEntity -> UserResponseDto.builder()
                        .userId(userEntity.getUserId())
                        .userName(userEntity.getUserName())
                        .email(userEntity.getEmail())
                        .build())
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }


    @GetMapping("/users/{userId}")
    public  ResponseEntity<UserResponseDto> findUser(@PathVariable("userId") String userId,@RequestBody UserRequestDto dto){

      UserRequestDto userRequestDto=userService.getUserByUserId(userId);

      UserResponseDto userResponseDto = UserResponseDto.builder()
              .userId(userRequestDto.getUserId())
              .userName(userRequestDto.getUserName())
              .email(userRequestDto.getEmail())
              .build();

        return ResponseEntity.status(HttpStatus.OK).body(userResponseDto);
    }
}
