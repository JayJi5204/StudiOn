package backend.service.user.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponseDto {

    private String userId;
    private String userName;
    private String email;
}
