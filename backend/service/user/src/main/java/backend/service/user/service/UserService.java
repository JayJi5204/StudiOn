package backend.service.user.service;


import backend.service.user.dto.request.UserRequestDto;
import backend.service.user.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    UserRequestDto createUser(UserRequestDto userRequestDto);

    UserRequestDto getUserByUserId(String userId);

    List<UserEntity> getUserByAll();

    UserRequestDto getUserDetailsByEmail(String email);
}
