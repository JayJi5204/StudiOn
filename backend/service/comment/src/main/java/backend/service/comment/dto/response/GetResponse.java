package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GetResponse {

    private String commentId;
    private String content;
    private String commentPath;
    private String boardId;
    private String userId;
    private String nickName;
    private Long likeCount;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static GetResponse from(CommentEntity entity, Long likeCount) {
        GetResponse dto = new GetResponse();
        dto.commentId = String.valueOf(entity.getCommentId());
        dto.content = entity.getContent();
        dto.commentPath = entity.getCommentPath().getPath();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.nickName = entity.getNickName();
        dto.likeCount = likeCount;
        dto.isDeleted = entity.getIsDeleted();
        dto.createdAt = entity.getCreatedAt();
        dto.modifiedAt = entity.getModifiedAt();
        return dto;
    }
}