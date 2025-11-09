package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UpdateResponseDto {

    private String userKey;
    private String userName;
    private String email;
    private LocalDateTime createAt;
    private Boolean isDeleted;
    private UserRole role;


    public static UpdateResponseDto from(UserEntity entity){
        UpdateResponseDto dto=new UpdateResponseDto();
        dto.userKey = entity.getUserKey();;
        dto.userName= entity.getUserName();
        dto.email= entity.getEmail();
        dto.createAt=entity.getCreateAt();
        dto.isDeleted=entity.getIsDeleted();
        dto.role=entity.getRole();
        return dto;
    }
}
