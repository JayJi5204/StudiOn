package backend.service.user.service;


import backend.service.user.dto.request.CreateRequestDto;
import backend.service.user.dto.request.DeleteRequestDto;
import backend.service.user.dto.request.UpdateRequestDto;
import backend.service.user.dto.response.CreateResponseDto;
import backend.service.user.dto.response.DeletedResponseDto;
import backend.service.user.dto.response.UpdateResponseDto;
//import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService {

    CreateResponseDto create(CreateRequestDto dto);

    CreateResponseDto getUserByUserKey(String userKey);

    List<CreateResponseDto> getUserByAll();

    CreateRequestDto getUserDetailsByEmail(String email);

    UpdateResponseDto update(UpdateRequestDto dto,Long userId);

    DeletedResponseDto delete(DeleteRequestDto dto,Long userId);
}
