package backend.service.board.dto.request;

import backend.common.enumType.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateRequest {

    @Schema(example = "수정된 제목입니다.")
    @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
    private String title;

    @Schema(example = "수정된 내용입니다.")
    private String content;

    @Schema(example = "NOTICE")
    private Category category;

    @Schema(example = "[\"태그1\", \"태그2\"]")
    private List<String> tags;
}