package com.studion.board_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/board-service")
@Log4j2
public class BoardController {

    Environment env;

    public BoardController(Environment env) {
        this.env = env;
    }


    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/message")
    public String message(@RequestHeader("board-request") String header) {
        log.info(header);
        return "message";
    }


    @GetMapping("/check")
    public String check(HttpServletRequest request) {
        log.info("Server port={}", request.getServerPort());

        return String.format("Hi, there. This is a message from Board Service on PORT %s"
                , env.getProperty("local.server.port"));
    }
}
