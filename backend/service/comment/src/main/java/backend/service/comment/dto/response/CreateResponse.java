package backend.service.comment.dto.response;

import backend.service.comment.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class CreateResponse {

    private String commentId;
    private String content;
    private String commentPath;
    private String userId;
    private String boardId;
    private Long likeCount;
    private String nickName;
    private Boolean isDelete;
    private LocalDateTime createAt;

    public static CreateResponse from(CommentEntity entity) {
        return from(entity, 0L);
    }

    public static CreateResponse from(CommentEntity entity, Long likeCount) {
        CreateResponse dto = new CreateResponse();
        dto.commentId = String.valueOf(entity.getCommentId());
        dto.content = entity.getContent();
        dto.commentPath = entity.getCommentPath().getPath();
        dto.userId = String.valueOf(entity.getUserId());
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.likeCount = likeCount;
        dto.isDelete = entity.getIsDelete();
        dto.createAt = entity.getCreateAt();
        return dto;
    }
}