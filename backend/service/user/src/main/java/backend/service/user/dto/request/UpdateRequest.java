package backend.service.user.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateRequest {

    @Email
    private String email;

    private String nickName;

    private String password;

    private String phoneNumber;
}
