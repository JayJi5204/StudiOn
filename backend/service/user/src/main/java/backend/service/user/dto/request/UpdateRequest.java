package backend.service.user.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateRequest {

    private Long userId;

    @Email
    private String email;

    private String username;

    private String password;
}
