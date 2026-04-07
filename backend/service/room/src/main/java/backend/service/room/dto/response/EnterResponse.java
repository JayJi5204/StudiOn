package backend.service.room.dto.response;

import backend.service.room.entity.RoomEntity;
import lombok.Data;

@Data
public class EnterResponse {
    private String roomId;
    private String message;


   public static EnterResponse from(RoomEntity roomEntity) {
       EnterResponse  dto = new EnterResponse();
       dto.roomId = String.valueOf(roomEntity.getRoomId());
       dto.message = dto.roomId+"번 방에 들어왔습니다";
       return dto;
   }
}
