package backend.service.chat.dto.response;

import backend.service.chat.entity.ChatEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateResponse {
    private String messageId;
    private String roomId;
    private String userId;
    private String nickName;
    private String message;
    private String sendAt;

    public static CreateResponse from(ChatEntity entity) {
        CreateResponse dto = new CreateResponse();
        dto.messageId = String.valueOf(entity.getMessageId());
        dto.roomId = entity.getRoomId();
        dto.userId = String.valueOf(entity.getUserId());
        dto.nickName = entity.getNickName();
        dto.message = entity.getMessage();
        dto.sendAt = entity.getSendAt();
        return dto;
    }
}