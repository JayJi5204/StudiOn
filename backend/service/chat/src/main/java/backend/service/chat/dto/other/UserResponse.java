package backend.service.chat.dto.other;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserResponse {
    private String userId;
    private String nickName;
    private String email;
}
