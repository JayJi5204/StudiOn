package backend.service.room.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private String roomName;
    private boolean isPrivate;
    private String password;
}