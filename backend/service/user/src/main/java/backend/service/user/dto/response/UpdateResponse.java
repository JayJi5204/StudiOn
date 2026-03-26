package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

@Getter
public class UpdateResponse {

    private String email;
    private String nickName;
    private UserRole role;
    private String phoneNumber;
    private String password;


    public static UpdateResponse from(UserEntity entity){
        UpdateResponse dto=new UpdateResponse();
        dto.nickName = entity.getNickName();
        dto.email= entity.getEmail();
        dto.role=entity.getRole();
        dto.password=entity.getPassword();
        dto.phoneNumber=entity.getPhoneNumber();
        return dto;
    }
}
