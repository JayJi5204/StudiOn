package backend.service.room.dto.request;

import lombok.Data;

@Data
public class SignalingMessage {
    private String type;
    private String roomId;
    private String userId;
    private String nickName;
    private Object data;
}