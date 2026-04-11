package backend.service.comment.dto.request;

import lombok.Data;

@Data
public class CreateRequestDto {
    private Long boardId;
    private String content;
    private String parentPath;

}
