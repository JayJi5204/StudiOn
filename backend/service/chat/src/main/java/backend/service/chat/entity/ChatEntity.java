package backend.service.chat.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Table(name = "chats")
@Getter
@NoArgsConstructor
public class ChatEntity {

    @Id
    private Long messageId;
    private String roomId;
    private Long userId;
    private String nickName;
    private String message;
    private String sendAt;

    public static ChatEntity create(Long messageId, String roomId, Long userId, String nickName, String message) {
        ChatEntity entity = new ChatEntity();
        entity.messageId = messageId;
        entity.roomId = roomId;
        entity.userId = userId;
        entity.nickName = nickName;
        entity.message = message;
        entity.sendAt = LocalDateTime.now().toString();
        return entity;
    }

    public static String createRoomId(Long userId1, Long userId2) {
        return Math.min(userId1, userId2) + ":" + Math.max(userId1, userId2);
    }
}