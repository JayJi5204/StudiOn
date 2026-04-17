package backend.service.room.controller;

import backend.service.room.dto.request.CreateRequest;
import backend.service.room.dto.request.EnterRequest;
import backend.service.room.dto.response.CreateResponse;
import backend.service.room.dto.response.EnterResponse;
import backend.service.room.dto.response.LeaveResponse;
import backend.service.room.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Room", description = "방 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "방 생성", description = "새로운 방을 생성합니다.")
    @PostMapping("/create")
    public CreateResponse create(@RequestBody CreateRequest request, HttpServletRequest httpRequest) {
        return roomService.create(request, httpRequest);
    }

    @Operation(summary = "방 조회", description = "방 정보를 조회합니다.")
    @GetMapping("/{roomId}")
    public CreateResponse getRoom(
            @Parameter(description = "방 ID") @PathVariable Long roomId) {
        return roomService.getRoom(roomId);
    }

    @Operation(
            summary = "방 입장",
            description = """
                방에 입장합니다.
                
                - 공개 방: body 없이 요청
                - 비공개 방: password 필수
                
                [비공개 방 예시]
                {
                    "password": "1234"
                }
                """
    )
    @PostMapping("/{roomId}/enter")
    public EnterResponse enter(
            @Parameter(description = "방 ID") @PathVariable Long roomId,
            @RequestBody(required = false) EnterRequest request,
            HttpServletRequest httpRequest
    ) {
        String password = request != null ? request.getPassword() : null;
        return roomService.enter(roomId, password,httpRequest);
    }

    @Operation(summary = "방 퇴장", description = "방에서 퇴장합니다.")
    @PostMapping("/{roomId}/leave")
    public LeaveResponse leave(
            @Parameter(description = "방 ID") @PathVariable Long roomId,
            HttpServletRequest httpRequest
    ) {
        return roomService.leave(roomId,httpRequest);
    }

    @Operation(
            summary = "초대코드로 방 입장",
            description = "초대코드를 이용하여 비공개 방에 바로 입장합니다."
    )
    @PostMapping("/invite/{inviteCode}")
    public EnterResponse enterByInviteCode(
            @Parameter(description = "초대코드") @PathVariable String inviteCode,
            HttpServletRequest httpRequest) {
        return roomService.enterByInviteCode(inviteCode,httpRequest);
    }

    @Operation(summary = "방 초대", description = "특정 유저를 방에 초대합니다.")
    @PostMapping("/{roomId}/invite/{targetUserId}")
    public void invite(
            @Parameter(description = "방 ID") @PathVariable Long roomId,
            @Parameter(description = "초대할 유저 ID") @PathVariable Long targetUserId,
            HttpServletRequest request) {
        roomService.invite(roomId, targetUserId, request);
    }
}
