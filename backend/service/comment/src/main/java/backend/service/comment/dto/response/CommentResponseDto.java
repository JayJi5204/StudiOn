package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private String commentPath;
    private Long userId;
    private Long boardId;
    private Boolean isDelete;
    private LocalDateTime createAt;

    public static CommentResponseDto from(CommentEntity commentEntity) {
        CommentResponseDto commentResponseDto = new CommentResponseDto();

        commentResponseDto.commentId = commentEntity.getCommentId();
        commentResponseDto.content = commentEntity.getContent();
        commentResponseDto.commentPath = commentEntity.getCommentPath().getPath();
        commentResponseDto.userId = commentEntity.getUserId();
        commentResponseDto.boardId = commentEntity.getBoardId();
        commentResponseDto.isDelete = commentEntity.getIsDelete();
        commentResponseDto.createAt = commentEntity.getCreateAt();
        return commentResponseDto;
    }
}
