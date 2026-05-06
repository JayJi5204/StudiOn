package backend.service.room.dto.response;

import backend.service.room.entity.RoomEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
@Data
public class GetRoomResponse {
    private String roomId;
    private String roomName;
    private String hostId;
    private int currentPeople;
    private int maxPeople;
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    private String inviteCode;
    private String createdAt;

    public static GetRoomResponse from(RoomEntity entity) {
        GetRoomResponse dto = new GetRoomResponse();
        dto.roomId = String.valueOf(entity.getRoomId());
        dto.roomName = entity.getRoomName();
        dto.hostId = String.valueOf(entity.getHostId());
        dto.currentPeople = entity.getCurrentPeople();
        dto.maxPeople = entity.getMaxPeople();
        dto.isPrivate = entity.isPrivate();
        dto.inviteCode = entity.getInviteCode();  // 추가
        dto.createdAt = entity.getCreatedAt().toString();
        return dto;
    }
}