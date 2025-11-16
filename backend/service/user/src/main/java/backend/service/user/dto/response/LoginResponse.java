package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoginResponse {

    private String email;
    private String username;
    private UserRole role;


    public static LoginResponse from(UserEntity entity) {
        LoginResponse response = new LoginResponse();
        response.email = entity.getEmail();
        response.username = entity.getUsername();
        response.role = entity.getRole();

        return response;

    }
}
