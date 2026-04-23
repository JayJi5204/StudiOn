package backend.service.groupChat.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private String roomId;
    private String message;
}