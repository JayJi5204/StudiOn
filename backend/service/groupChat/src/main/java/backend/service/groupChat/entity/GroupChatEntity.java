package backend.service.groupChat.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "group_chats")
@Getter
@NoArgsConstructor
public class GroupChatEntity {

    @Id
    private Long messageId;
    private Long roomId;
    private Long userId;
    private String nickName;
    private String message;
    private String sendAt;

    public static GroupChatEntity create(Long messageId, Long roomId, Long userId, String nickName, String message) {
        GroupChatEntity entity = new GroupChatEntity();
        entity.messageId = messageId;
        entity.roomId = roomId;
        entity.userId = userId;
        entity.nickName = nickName;
        entity.message = message;
        entity.sendAt = LocalDateTime.now().toString();
        return entity;
    }
}