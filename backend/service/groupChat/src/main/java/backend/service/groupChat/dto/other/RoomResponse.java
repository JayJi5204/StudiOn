package backend.service.groupChat.dto.other;

import lombok.Data;

@Data
public class RoomResponse {
    private String roomId;
    private String roomName;
    private int maxPeople;
    private int currentPeople;
    private boolean isPrivate;
    private String createdAt;
}