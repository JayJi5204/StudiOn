package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateResponse {

    private String commentId;
    private String content;
    private String commentPath;
    private String boardId;
    private String userId;
    private Long likeCount;
    private String nickName;
    private Boolean isDelete;
    private LocalDateTime createdAt;

    public static CreateResponse from(CommentEntity entity, Long likeCount) {
        CreateResponse dto = new CreateResponse();
        dto.commentId = String.valueOf(entity.getCommentId());
        dto.content = entity.getContent();
        dto.userId=String.valueOf(entity.getUserId());
        dto.commentPath = entity.getCommentPath().getPath();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.likeCount = likeCount;
        dto.isDelete = entity.getIsDeleted();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }
}