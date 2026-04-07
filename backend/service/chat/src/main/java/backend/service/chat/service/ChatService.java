package backend.service.chat.service;

import backend.service.chat.dto.response.CreateResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatService {
    void sendMessage(String roomId, String message, Long userId, String nickName);
    List<CreateResponse> getMessages(String roomId, Pageable pageable);
    List<CreateResponse> getMessagesBefore(String roomId, LocalDateTime sendAt, Pageable pageable);
    String createRoomId(Long userId1, Long userId2);
}