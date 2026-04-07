package backend.service.chat.controller;

import backend.service.chat.dto.request.CreateRequest;
import backend.service.chat.service.ChatRoomManager;
import backend.service.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 * WebSocket 채팅 API (STOMP 프로토콜)
 *
 * 연결: ws://localhost:8000/chat-service/ws/chat
 * CONNECT 헤더: userId, nickName 필수
 *
 * [메시지 전송]
 * endpoint: /pub/chat/message
 * payload: { "roomId": "1:2", "message": "안녕하세요" }
 *
 * [채팅방 입장]
 * endpoint: /pub/chat/enter
 * payload: { "roomId": "1:2" }
 * 구독: /sub/chat/{roomId}
 *
 * [채팅방 퇴장]
 * endpoint: /pub/chat/leave
 * payload: { "roomId": "1:2" }
 */


@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final ChatService chatService;
    private final ChatRoomManager chatRoomManager;

    // 메시지 전송 (STOMP)
    @MessageMapping("/chat/message")
    public void sendMessage(@Payload CreateRequest request, SimpMessageHeaderAccessor headerAccessor) {
        // STOMP 헤더에서 userId, nickName 꺼내기
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        String nickName = (String) headerAccessor.getSessionAttributes().get("nickName");

        chatService.sendMessage(
                request.getRoomId(),
                request.getMessage(),
                Long.valueOf(userId),
                nickName
        );
    }

    // 채팅방 입장
    @MessageMapping("/chat/enter")
    public void enter(@Payload CreateRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");

        // Redis 채널 구독
        chatRoomManager.subscribe(request.getRoomId());

        log.info("채팅방 입장 roomId={}, userId={}", request.getRoomId(), userId);
    }

    // 채팅방 퇴장
    @MessageMapping("/chat/leave")
    public void leave(@Payload CreateRequest request) {
        chatRoomManager.unsubscribe(request.getRoomId());
        log.info("채팅방 퇴장 roomId={}", request.getRoomId());
    }
}