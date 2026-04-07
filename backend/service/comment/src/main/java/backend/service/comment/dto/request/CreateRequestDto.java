package backend.service.comment.dto.request;

import lombok.Data;

@Data
public class CreateRequestDto {
    private Long userId;
    private Long boardId;
    private String nickName;
    private String content;
    private String parentPath;

}
