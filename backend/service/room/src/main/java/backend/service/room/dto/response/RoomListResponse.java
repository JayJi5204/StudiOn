package backend.service.room.dto.response;

import backend.service.room.entity.RoomEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RoomListResponse {
    private String roomId;
    private String roomName;
    private int currentPeople;
    private int maxPeople;
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    private String createdAt;

    public static RoomListResponse from(RoomEntity entity) {
        RoomListResponse dto = new RoomListResponse();
        dto.roomId = String.valueOf(entity.getRoomId());
        dto.roomName = entity.getRoomName();
        dto.currentPeople = entity.getCurrentPeople();
        dto.maxPeople = entity.getMaxPeople();
        dto.isPrivate = entity.isPrivate();
        dto.createdAt=entity.getCreatedAt().toString();
        return dto;
    }
}