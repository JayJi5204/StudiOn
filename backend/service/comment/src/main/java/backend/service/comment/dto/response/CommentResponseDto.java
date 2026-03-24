package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponseDto {

    private String commentId;
    private String content;
    private String commentPath;
    private String userId;
    private String boardId;
    private Boolean isDelete;
    private LocalDateTime createAt;

    public static CommentResponseDto from(CommentEntity commentEntity) {

        CommentResponseDto commentResponseDto = new CommentResponseDto();

        commentResponseDto.commentId = String.valueOf(commentEntity.getCommentId());
        commentResponseDto.content = commentEntity.getContent();
        commentResponseDto.commentPath = commentEntity.getCommentPath().getPath();
        commentResponseDto.userId = String.valueOf(commentEntity.getUserId());
        commentResponseDto.boardId = String.valueOf(commentEntity.getBoardId());
        commentResponseDto.isDelete = commentEntity.getIsDelete();
        commentResponseDto.createAt = commentEntity.getCreateAt();

        return commentResponseDto;
    }
}