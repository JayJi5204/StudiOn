package backend.service.user.service;


import backend.service.user.dto.request.UserRequestDto;
import backend.service.user.dto.response.UserResponseDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    UserResponseDto createUser(UserRequestDto userRequestDto);

    UserResponseDto getUserByUserKey(String userKey);

    List<UserResponseDto> getUserByAll();

    UserRequestDto getUserDetailsByEmail(String email);
}
