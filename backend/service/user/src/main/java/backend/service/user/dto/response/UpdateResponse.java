package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.common.enumType.UserRole;
import lombok.Getter;

@Getter
public class UpdateResponse {

    private String email;
    private String nickName;
    private UserRole role;
    private String phoneNumber;
    private String password;
    private String bio;


    public static UpdateResponse from(UserEntity entity){
        UpdateResponse dto=new UpdateResponse();
        dto.nickName = entity.getNickName();
        dto.email= entity.getEmail();
        dto.role=entity.getRole();
        dto.password=entity.getPassword();
        dto.phoneNumber=entity.getPhoneNumber();
        dto.bio=entity.getBio();
        return dto;
    }
}
