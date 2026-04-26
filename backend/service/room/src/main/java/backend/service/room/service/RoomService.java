package backend.service.room.service;

import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.EnterResponse;
import backend.service.room.dto.response.GetRoomResponse;
import backend.service.room.dto.response.LeaveResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface RoomService {
    CreateResponse create(CreateRequest request, HttpServletRequest httpRequest);
    GetRoomResponse getRoom(Long roomId);
    void invite(Long roomId, Long targetUserId, HttpServletRequest request);
    void forceDelete(Long roomId, HttpServletRequest request);
    List<GetRoomResponse> getAllRooms();
    void joinRoom(Long roomId, Long userId);
    void leaveRoom(Long roomId, Long userId);
    GetRoomResponse getRoomByInviteCode(String inviteCode);
}