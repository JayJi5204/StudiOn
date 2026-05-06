package backend.service.chat.dto.response;

import backend.service.chat.entity.ChatEntity;
import lombok.Data;

@Data
public class ChatRoomResponse {
    private String roomId;
    private String partnerId;
    private String partnerNickName;
    private String lastMessage;
    private String lastMessageAt;

    public static ChatRoomResponse from(ChatEntity entity, Long myUserId, String partnerNickName) {
        ChatRoomResponse dto = new ChatRoomResponse();
        dto.roomId = entity.getRoomId();
        String[] ids = entity.getRoomId().split("_");
        dto.partnerId = Long.parseLong(ids[0]) == myUserId ? ids[1] : ids[0];
        dto.partnerNickName = partnerNickName;
        dto.lastMessage = entity.getMessage();
        dto.lastMessageAt = entity.getSendAt();
        return dto;
    }
}