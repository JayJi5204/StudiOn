package backend.service.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteRequest {

    @Schema(example = "Test1234!")
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
}
