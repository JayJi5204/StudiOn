package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Data;

@Data
public class LoginResponse {

    private String userId;
    private String email;
    private String username;
    private UserRole role;
    private Boolean isLogin;


    public static LoginResponse from(UserEntity entity) {
        LoginResponse response = new LoginResponse();
        response.userId = String.valueOf(entity.getUserId());
        response.email = entity.getEmail();
        response.username = entity.getNickName();
        response.role = entity.getRole();
        response.isLogin = true;

        return response;

    }
}
