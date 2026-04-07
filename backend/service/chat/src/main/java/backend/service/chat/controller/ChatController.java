package backend.service.chat.controller;

import backend.service.chat.dto.response.CreateResponse;
import backend.service.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "Chat", description = "1대1 채팅 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Operation(
            summary = "채팅방 메시지 조회",
            description = """
                    특정 채팅방의 메시지를 최신순으로 조회합니다.
                    
                    - roomId: 두 유저의 ID 조합 (작은 ID:큰 ID)
                    - 예시: userId 1, userId 2 → roomId "1:2"
                    """
    )
    @GetMapping("/messages/{roomId}")
    public List<CreateResponse> getMessages(
            @Parameter(description = "채팅방 ID", example = "1:2") @PathVariable String roomId,
            @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "20") @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return chatService.getMessages(roomId, pageable);
    }

    @Operation(
            summary = "이전 메시지 조회 (무한 스크롤)",
            description = """
                    특정 시간 이전의 메시지를 조회합니다. (무한 스크롤용)
                    
                    - lastSendAt: 마지막으로 받은 메시지의 sendAt 값
                    - 첫 조회 시 lastSendAt 없이 요청
                    """
    )
    @GetMapping("/messages/{roomId}/before")
    public List<CreateResponse> getMessagesBefore(
            @Parameter(description = "채팅방 ID", example = "1:2") @PathVariable String roomId,
            @Parameter(description = "마지막 메시지 시간 (첫 조회 시 null)") @RequestParam(required = false) LocalDateTime lastSendAt,
            @Parameter(description = "페이지 크기", example = "20") @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(0, size);

        if (lastSendAt == null) {
            return chatService.getMessages(roomId, pageable);
        }
        return chatService.getMessagesBefore(roomId, lastSendAt, pageable);
    }

    @Operation(summary = "채팅방 ID 생성", description = "두 유저의 ID로 채팅방 ID를 생성합니다. 항상 작은 ID:큰 ID 형태로 생성됩니다.")
    @GetMapping("/room")
    public String getRoomId(
            @Parameter(description = "유저1 ID") @RequestParam Long userId1,
            @Parameter(description = "유저2 ID") @RequestParam Long userId2) {
        return chatService.createRoomId(userId1, userId2);
    }
}