package backend.service.room.dto.response;

import backend.service.room.entity.RoomEntity;
import lombok.Data;

@Data
public class LeaveResponse {
    private String roomId;
    private String message;


   public static LeaveResponse from(RoomEntity roomEntity) {
       LeaveResponse dto = new LeaveResponse();
       dto.roomId = String.valueOf(roomEntity.getRoomId());
       dto.message = dto.roomId+"번 방을 나갔습니다";
       return dto;
   }
}
