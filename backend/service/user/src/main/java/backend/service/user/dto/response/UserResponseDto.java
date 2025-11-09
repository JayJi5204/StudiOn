package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDto {

    private String userId;
    private String userName;
    private String email;
    private LocalDateTime createAt;


    public static UserResponseDto from(UserEntity entity){
        UserResponseDto dto=new UserResponseDto();
        dto.userId= entity.getUserKey();;
        dto.userName= entity.getUserName();
        dto.email= entity.getEmail();
        dto.createAt=entity.getCreateAt();

        return dto;
    }
}
