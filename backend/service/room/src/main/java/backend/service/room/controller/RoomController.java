package backend.service.room.controller;

import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.request.EnterRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.EnterResponse;
import backend.service.room.dto.response.GetRoomResponse;
import backend.service.room.dto.response.LeaveResponse;
import backend.service.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Room", description = "방 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "방 생성", description = "새로운 방을 생성합니다.")
    @PostMapping("/create")
    public CreateResponse create(@RequestBody @Valid CreateRequest request, HttpServletRequest httpRequest) {
        return roomService.create(request, httpRequest);
    }

    @Operation(summary = "방 조회", description = "방 정보를 조회합니다.")
    @GetMapping("/{roomId}")
    public GetRoomResponse getRoom(
            @Parameter(description = "방 ID") @PathVariable Long roomId) {
        return roomService.getRoom(roomId);
    }

    @GetMapping("/invite/{inviteCode}")
    public GetRoomResponse getRoomByInviteCode(
            @Parameter(description = "초대코드") @PathVariable String inviteCode) {
        return roomService.getRoomByInviteCode(inviteCode);
    }

    @Operation(summary = "방 초대", description = "특정 유저를 방에 초대합니다.")
    @PostMapping("/{roomId}/invite/{targetUserId}")
    public void invite(
            @Parameter(description = "방 ID") @PathVariable Long roomId,
            @Parameter(description = "초대할 유저 ID") @PathVariable Long targetUserId,
            HttpServletRequest request) {
        roomService.invite(roomId, targetUserId, request);
    }

    @Operation(summary = "방 강제 삭제 (관리자)", description = "관리자가 방을 강제 삭제합니다.")
    @DeleteMapping("/admin/force/{roomId}")
    public void forceDelete(
            @Parameter(description = "삭제할 방 ID") @PathVariable Long roomId,
            HttpServletRequest request) {
        roomService.forceDelete(roomId, request);
    }

    @Operation(summary = "전체 방 조회", description = "전체 방 목록을 조회합니다.")
    @GetMapping("/list")
    public List<GetRoomResponse> getAllRooms() {
        return roomService.getAllRooms();
    }
}
