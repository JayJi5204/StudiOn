package com.studion.user_service.SeviceTest;


import com.studion.user_service.dto.request.UserRequestDto;
import com.studion.user_service.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class UserTest {

    @Autowired
    UserService userService;

    // 유저 생성 테스트
    @Test
    void createUserTest() {

        UserRequestDto dto = new UserRequestDto();
        dto.setEmail("test@example.com");
        dto.setUserName("Tester");
        dto.setPassword("password");

        UserRequestDto userRequestDto =userService.createUser(dto);
        log.info(userRequestDto.getUserName()+", "+ userRequestDto.getEmail()+", "+ userRequestDto.getPassword());
    }
}
