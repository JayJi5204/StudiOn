package backend.service.room.service;

import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.EnterResponse;
import backend.service.room.dto.response.LeaveResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface RoomService {
    CreateResponse create(CreateRequest request, HttpServletRequest httpRequest);
    CreateResponse getRoom(Long roomId);
    EnterResponse enter(Long roomId, String password, HttpServletRequest httpRequest);
    LeaveResponse leave(Long roomId, HttpServletRequest httpRequest);
    EnterResponse enterByInviteCode(String inviteCode, HttpServletRequest httpRequest);
    void invite(Long roomId, Long targetUserId, HttpServletRequest request);
}