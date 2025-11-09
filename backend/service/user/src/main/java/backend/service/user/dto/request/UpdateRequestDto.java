package backend.service.user.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateRequestDto {

    private Long userId;

    @Email
    private String email;

    private String userName;

    private String password;
}
