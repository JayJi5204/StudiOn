package backend.service.comment.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private String boardId;
    private String content;
    private String parentPath;
}
