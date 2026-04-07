package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Data;

@Data
public class LoginResponse {

    private String userId;
    private String email;
    private String nickName;
    private UserRole role;
    private Boolean isLoggedIn;


    public static LoginResponse from(UserEntity entity) {
        LoginResponse response = new LoginResponse();
        response.userId = String.valueOf(entity.getUserId());
        response.email = entity.getEmail();
        response.nickName = entity.getNickName();
        response.role = entity.getRole();
        response.isLoggedIn = true;

        return response;

    }
}
