package backend.service.user.service;


import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.CreateResponse;
import backend.service.user.dto.response.DeletedResponse;
import backend.service.user.dto.response.UpdateResponse;

import java.util.List;

public interface UserService {

    CreateResponse create(CreateRequest dto);

    CreateResponse getUserByUserId(Long userId);

    List<CreateResponse> getUserByAll();


    UpdateResponse update(UpdateRequest dto, Long userId);

    DeletedResponse delete(DeleteRequest dto, Long userId);
}
