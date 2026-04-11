package backend.service.groupChat.controller;

import backend.service.groupChat.dto.request.CreateRequest;
import backend.service.groupChat.service.GroupChatRoomManager;
import backend.service.groupChat.service.GroupChatService;
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

/**
 * WebSocket 그룹 채팅 API (STOMP 프로토콜)
 *
 * 연결: ws://localhost:8000/groupChat-service/ws/group-chat
 * CONNECT 헤더: userId, nickName 필수
 *
 * [메시지 전송]
 * endpoint: /pub/group-chat/message
 * payload: { "roomId": 123456789, "message": "안녕하세요" }
 *
 * [채팅방 입장]
 * endpoint: /pub/group-chat/enter
 * payload: { "roomId": 123456789 }
 * 구독: /sub/group-chat/{roomId}
 *
 * [채팅방 퇴장]
 * endpoint: /pub/group-chat/leave
 * payload: { "roomId": 123456789 }
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final GroupChatService groupChatService;
    private final GroupChatRoomManager groupChatRoomManager;

    @MessageMapping("/group-chat/message")
    public void sendMessage(@Payload CreateRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        String nickName = (String) headerAccessor.getSessionAttributes().get("nickName");

        groupChatService.sendMessage(
                request.getRoomId(),
                request.getMessage(),
                Long.valueOf(userId),
                nickName
        );
    }

    @MessageMapping("/group-chat/enter")
    public void enter(@Payload CreateRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        groupChatRoomManager.subscribe(String.valueOf(request.getRoomId()));
        log.info("채팅방 입장 roomId={}, userId={}", request.getRoomId(), userId);
    }

    @MessageMapping("/group-chat/leave")
    public void leave(@Payload CreateRequest request) {
        groupChatRoomManager.unsubscribe(String.valueOf(request.getRoomId()));
        log.info("채팅방 퇴장 roomId={}", request.getRoomId());
    }
}