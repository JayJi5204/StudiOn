package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoginResponse {

    private Long userId;
    private String email;
    private String username;
    private UserRole role;
    private String accessToken;


    public static LoginResponse from(UserEntity entity,String accessToken) {
        LoginResponse response = new LoginResponse();
        response.userId = entity.getUserId();
        response.email = entity.getEmail();
        response.username = entity.getUsername();
        response.role = entity.getRole();
        response.accessToken=accessToken;

        return response;

    }
}
