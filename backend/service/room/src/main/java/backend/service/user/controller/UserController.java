package backend.service.user.controller;

import backend.service.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Room", description = "화상 방 관리 API")
@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class UserController {

    private final UserService userService;

}