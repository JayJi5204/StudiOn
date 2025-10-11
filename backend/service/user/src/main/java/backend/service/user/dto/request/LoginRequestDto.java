package backend.service.user.dto.request;

import lombok.Data;

@Data
public class LoginRequestDto {

    private String email;
    private String password;
}
