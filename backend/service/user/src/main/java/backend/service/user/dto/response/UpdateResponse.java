package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

@Getter
public class UpdateResponse {

    private String email;
    private String username;
    private UserRole role;


    public static UpdateResponse from(UserEntity entity){
        UpdateResponse dto=new UpdateResponse();
        dto.username = entity.getUsername();
        dto.email= entity.getEmail();
        dto.role=entity.getRole();
        return dto;
    }
}
