package backend.service.room.dto.response;

import backend.service.room.entity.RoomEntity;
import lombok.Data;

@Data
public class CreateResponse {
    private String roomId;
    private String roomName;
    private String inviteCode;
    private int maxPeople;
    private int currentPeople;
    private boolean isPrivate;
    private String createdAt;

    public static CreateResponse from(RoomEntity entity) {
        CreateResponse dto = new CreateResponse();
        dto.roomId = String.valueOf(entity.getRoomId());
        dto.roomName = entity.getRoomName();
        dto.inviteCode = entity.getInviteCode();
        dto.maxPeople = entity.getMaxPeople();
        dto.currentPeople = entity.getCurrentPeople();
        dto.isPrivate = entity.isPrivate();
        dto.createdAt = entity.getCreatedAt().toString();  // String으로 변환
        return dto;
    }
}
