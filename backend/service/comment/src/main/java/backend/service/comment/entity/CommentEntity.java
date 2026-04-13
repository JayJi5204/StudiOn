package backend.service.comment.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor
public class CommentEntity {

    @Id
    private Long commentId;
    private String content;
    @Embedded
    private CommentPath commentPath;
    private Long userId;
    private Long boardId;
    private String nickName;
    private Long likeCount;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static CommentEntity create(Long commentId, String content, CommentPath commentPath, Long boardId,Long UserId,String nickName) {
        CommentEntity commentEntity = new CommentEntity();
        commentEntity.commentId = commentId;
        commentEntity.content = content;
        commentEntity.commentPath=commentPath;
        commentEntity.boardId = boardId;
        commentEntity.userId = UserId;
        commentEntity.nickName = nickName;
        commentEntity.likeCount = 0L;
        commentEntity.createdAt = LocalDateTime.now();
        commentEntity.modifiedAt = LocalDateTime.now();
        commentEntity.isDeleted = false;
        return commentEntity;
    }
    public void update(String content) {
        this.content = content;
        this.modifiedAt = LocalDateTime.now();
    }

    public boolean isRoot() {
        return commentPath.isRoot();
    }

    public void delete() {
        isDeleted = true;
    }

    public void syncLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

}
