package backend.service.room.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EnterRequest {

    @Schema(example = "1234")
    @Size(min = 4, max = 20, message = "비밀번호는 4~20자여야 합니다.")
    private String password;
}