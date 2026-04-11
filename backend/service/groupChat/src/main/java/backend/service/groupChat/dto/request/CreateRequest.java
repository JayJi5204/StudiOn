package backend.service.groupChat.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private Long roomId;
    private String message;
}