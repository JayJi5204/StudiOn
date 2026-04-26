package backend.service.room.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRequest {

    @Schema(example = "스터디룸")
    @NotBlank(message = "방 이름은 필수입니다.")
    @Size(max = 20, message = "방 이름은 20자 이하여야 합니다.")
    private String roomName;

    @Schema(example = "false")
    private boolean isPrivate;

    @Schema(example = "1234")
    @Size(min = 4, max = 20, message = "비밀번호는 4~20자여야 합니다.")
    private String password;
}