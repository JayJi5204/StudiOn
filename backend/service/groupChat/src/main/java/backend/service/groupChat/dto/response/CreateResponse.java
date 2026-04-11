package backend.service.groupChat.dto.response;

import backend.service.groupChat.entity.GroupChatEntity;
import lombok.Data;

@Data
public class CreateResponse {
    private String messageId;
    private String roomId;
    private String userId;
    private String nickName;
    private String message;
    private String sendAt;

    public static CreateResponse from(GroupChatEntity entity) {
        CreateResponse dto = new CreateResponse();
        dto.messageId = String.valueOf(entity.getMessageId());
        dto.roomId = String.valueOf(entity.getRoomId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.nickName = entity.getNickName();
        dto.message = entity.getMessage();
        dto.sendAt = entity.getSendAt();
        return dto;
    }
}