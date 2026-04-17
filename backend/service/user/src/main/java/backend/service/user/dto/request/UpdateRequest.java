package backend.service.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class UpdateRequest {

    @Schema(example = "test@example.com")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @Schema(example = "홍길동")
    @Size(min = 2, max = 10, message = "닉네임은 2~10자여야 합니다.")
    private String nickName;

    @Schema(example = "Test1234!")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
            message = "비밀번호는 8자 이상, 대문자, 숫자, 특수문자를 포함해야 합니다."
    )
    private String password;

    @Schema(example = "01012345678")
    @Pattern(regexp = "^01[0-9]{8,9}$", message = "휴대폰 번호 형식이 올바르지 않습니다.")
    private String phoneNumber;

    @Schema(example = "안녕하세요!")
    private String bio;
}