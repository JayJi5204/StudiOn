package backend.service.user.service;


import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

public interface UserService {

    CreateResponse create(CreateRequest dto);

    List<CreateResponse> getAllUsers();

    GetUserResponse getUser(Long userId);

    UpdateResponse update(UpdateRequest dto, Long userId);

    DeletedResponse delete(DeleteRequest dto, Long userId);

    LoginResponse login(LoginRequest dto, HttpServletResponse response);
}
