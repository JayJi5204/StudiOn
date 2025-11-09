package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

@Getter
public class UpdateResponseDto {

    private Long userId;
    private String userName;
    private String email;
    private UserRole role;


    public static UpdateResponseDto from(UserEntity entity){
        UpdateResponseDto dto=new UpdateResponseDto();
        dto.userId = entity.getUserId();;
        dto.userName= entity.getUserName();
        dto.email= entity.getEmail();
        dto.role=entity.getRole();
        return dto;
    }
}
