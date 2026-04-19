package backend.service.user.service;


import backend.service.user.dto.request.CreateRequest;
import backend.service.user.dto.request.DeleteRequest;
import backend.service.user.dto.request.LoginRequest;
import backend.service.user.dto.request.UpdateRequest;
import backend.service.user.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

public interface UserService {

    CreateResponse create(CreateRequest dto);

    List<GetAllResponse> getAllUsers();

    GetMyInfoResponse getMyInfo(HttpServletRequest request);

    UpdateResponse update(UpdateRequest dto ,HttpServletRequest request);

    DeletedResponse delete(DeleteRequest dto, HttpServletRequest request);

    LoginResponse login(LoginRequest dto, HttpServletResponse response);

    GetUserResponse getUser(Long userId);

    GetUserResponse getUserByAdmin(Long userId);

    LogoutResponse logout(HttpServletResponse response,HttpServletRequest request);

    void reissue(HttpServletRequest request, HttpServletResponse response);

    List<StudyRankingResponse> getStudyRanking(int top);

    List<StudyDailyResponse> getDailyStudy(int days, HttpServletRequest request);

    Long getMyStudyRank(HttpServletRequest request);


    void forceDelete(Long targetUserId, HttpServletRequest request);

}
