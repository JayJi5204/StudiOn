package com.studion.user_service.service;


import com.studion.user_service.dto.request.UserRequestDto;
import com.studion.user_service.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    UserRequestDto createUser(UserRequestDto userRequestDto);

    UserRequestDto getUserByUserId(String userId);

    List<UserEntity> getUserByAll();

    UserRequestDto getUserDetailsByEmail(String email);
}
