package backend.service.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRequestDto {


    @NotNull(message = "아이디는 null일 수 없습니다.")
    @Size(min = 1, message ="아이디를 입력해주세요")
    private String userKey;

    @NotNull(message = "이메일은 null일 수 없습니다.")
    @Size(min = 2, message = "이메일이 너무 짧습니다.")
    @Email
    private String email;

    @NotNull(message = "이메일은 null일 수 없습니다.")
    @Size(min = 2, message = "이름이 너무 짧습니다.")
    private String userName;

    @NotNull(message = "이메일은 null일 수 없습니다.")
    @Size(min = 8, message = "비밀번호가 너무 짧습니다.")
    private String password;

}