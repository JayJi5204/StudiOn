package backend.service.room.util;

import backend.common.exception.CustomException;
import backend.service.room.dto.request.SignalingMessage;
import backend.service.room.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class SignalingHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final RoomService roomService;

    private final Map<String, Map<String, WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<String, String[]> sessionInfo = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebRTC 시그널링 연결 sessionId={}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        SignalingMessage signalingMessage = objectMapper.readValue(message.getPayload(), SignalingMessage.class);
        String roomId = signalingMessage.getRoomId();
        String userId = signalingMessage.getUserId();

        switch (signalingMessage.getType()) {
            case "join" -> handleJoin(session, roomId, userId, signalingMessage.getNickName());
            case "offer" -> handleOffer(session, roomId, userId, signalingMessage);
            case "answer" -> handleAnswer(session, roomId, userId, signalingMessage);
            case "ice-candidate" -> handleIceCandidate(session, roomId, userId, signalingMessage);
            case "leave" -> handleLeave(session, roomId, userId);
        }
    }

    private void handleJoin(WebSocketSession session, String roomId, String userId, String nickName) throws Exception {
        try {
            roomService.joinRoom(Long.parseLong(roomId), Long.parseLong(userId));
        } catch (CustomException e) {
            SignalingMessage errorMsg = new SignalingMessage();
            errorMsg.setType("error");
            errorMsg.setData(e.getMessage());
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorMsg)));
            return;
        }

        rooms.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>()).put(userId, session);
        sessionInfo.put(session.getId(), new String[]{roomId, userId});
        log.info("방 입장 roomId={}, userId={}", roomId, userId);

        SignalingMessage joinMsg = new SignalingMessage();
        joinMsg.setType("join");
        joinMsg.setRoomId(roomId);
        joinMsg.setUserId(userId);
        joinMsg.setNickName(nickName);  // 추가
        broadcast(roomId, userId, joinMsg);
    }

    private void handleLeave(WebSocketSession session, String roomId, String userId) throws Exception {
        rooms.getOrDefault(roomId, new ConcurrentHashMap<>()).remove(userId);
        sessionInfo.remove(session.getId());

        // DB/Redis 퇴장 처리
        roomService.leaveRoom(Long.parseLong(roomId), Long.parseLong(userId));

        SignalingMessage leaveMsg = new SignalingMessage();
        leaveMsg.setType("leave");
        leaveMsg.setRoomId(roomId);
        leaveMsg.setUserId(userId);
        broadcast(roomId, userId, leaveMsg);
    }

    private void handleOffer(WebSocketSession session, String roomId, String userId, SignalingMessage message) throws Exception {
        log.info("offer roomId={}, userId={}", roomId, userId);
        broadcast(roomId, userId, message);
    }

    private void handleAnswer(WebSocketSession session, String roomId, String userId, SignalingMessage message) throws Exception {
        log.info("answer roomId={}, userId={}", roomId, userId);
        broadcast(roomId, userId, message);
    }

    private void handleIceCandidate(WebSocketSession session, String roomId, String userId, SignalingMessage message) throws Exception {
        log.info("ice-candidate roomId={}, userId={}", roomId, userId);
        broadcast(roomId, userId, message);
    }

    private void broadcast(String roomId, String senderId, SignalingMessage message) throws Exception {
        Map<String, WebSocketSession> room = rooms.get(roomId);
        if (room == null) return;

        String json = objectMapper.writeValueAsString(message);
        for (Map.Entry<String, WebSocketSession> entry : room.entrySet()) {
            if (!entry.getKey().equals(senderId) && entry.getValue().isOpen()) {
                entry.getValue().sendMessage(new TextMessage(json));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String[] info = sessionInfo.remove(session.getId());
        if (info != null) {
            String roomId = info[0];
            String userId = info[1];

            Map<String, WebSocketSession> room = rooms.get(roomId);
            if (room != null) {
                room.remove(userId);
                if (room.isEmpty()) rooms.remove(roomId);
            }

            // 브라우저 종료 시 자동 퇴장
            try {
                roomService.leaveRoom(Long.parseLong(roomId), Long.parseLong(userId));
            } catch (Exception e) {
                log.error("자동 퇴장 처리 실패 userId={}", userId, e);
            }

            // 나머지 참여자에게 퇴장 알림
            SignalingMessage leaveMsg = new SignalingMessage();
            leaveMsg.setType("leave");
            leaveMsg.setRoomId(roomId);
            leaveMsg.setUserId(userId);
            try { broadcast(roomId, userId, leaveMsg); } catch (Exception e) { }

            log.info("자동 퇴장 roomId={}, userId={}", roomId, userId);
        }
    }
}