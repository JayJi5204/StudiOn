package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateResponse {

    private String commentId;
    private String content;
    private String commentPath;
    private String boardId;
    private String userId;
    private String nickName;
    private LocalDateTime modifiedAt;

    public static UpdateResponse from(CommentEntity entity) {
        UpdateResponse dto = new UpdateResponse();
        dto.commentId = String.valueOf(entity.getCommentId());
        dto.content = entity.getContent();
        dto.userId=String.valueOf(entity.getUserId());
        dto.commentPath = entity.getCommentPath().getPath();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.modifiedAt = entity.getModifiedAt();
        return dto;
    }
}