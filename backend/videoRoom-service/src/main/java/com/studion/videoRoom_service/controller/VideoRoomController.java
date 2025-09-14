package com.studion.videoRoom_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/videoroom-service")
@Log4j2
public class VideoRoomController {

    Environment env;

    public VideoRoomController(Environment env) {
        this.env = env;
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/message")
    public String message(@RequestHeader("videoroom-request") String header) {
        log.info(header);
        return "message";
    }

    @GetMapping("/check")
    public String check(HttpServletRequest request) {
        log.info("Server port={}", request.getServerPort());

        return String.format("Hi, there. This is a message from VideoRoom Service on PORT %s"
                , env.getProperty("local.server.port"));
    }
}
