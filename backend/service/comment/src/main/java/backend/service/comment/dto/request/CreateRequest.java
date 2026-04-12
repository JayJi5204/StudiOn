package backend.service.comment.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private Long boardId;
    private String content;
    private String parentPath;
}
