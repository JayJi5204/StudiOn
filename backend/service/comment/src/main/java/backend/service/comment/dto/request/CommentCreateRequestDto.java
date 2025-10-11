package backend.service.comment.dto.request;

import lombok.Data;

@Data
public class CommentCreateRequestDto {
    private Long userId;
    private Long boardId;
    private String content;
    private Long parentCommentId;

}
