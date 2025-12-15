package backend.service.user.service;


import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.CreateResponse;
import backend.service.user.dto.response.DeletedResponse;
import backend.service.user.dto.response.LoginResponse;
import backend.service.user.dto.response.UpdateResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

public interface UserService {

    CreateResponse create(CreateRequest dto);

    CreateResponse getUserByUserId(Long userId);

    List<CreateResponse> getUserByAll();

    UpdateResponse update(UpdateRequest dto, Long userId);

    DeletedResponse delete(DeleteRequest dto, Long userId);

    LoginResponse login(LoginRequest dto, HttpServletResponse response);
}
