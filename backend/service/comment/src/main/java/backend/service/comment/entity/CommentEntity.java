package backend.service.comment.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor
public class CommentEntity {

    @Id
    private Long commentId;
    private String content;
    private Long parentCommentId;
    private Long userId;
    private Long boardId;
    private Boolean isDelete;
    private LocalDateTime createAt;

    public static CommentEntity create(Long commentId, String content, Long parentCommentId,Long userId, Long boardId) {
        CommentEntity commentEntity=new CommentEntity();
        commentEntity.commentId = commentId;
        commentEntity.content = content;
        commentEntity.parentCommentId = parentCommentId==null?commentId:parentCommentId;
        commentEntity.userId=userId;
        commentEntity.boardId = boardId;
        commentEntity.createAt = LocalDateTime.now();
        commentEntity.isDelete=false;
        return commentEntity;
    }


    public boolean isRoot(){
        return parentCommentId.longValue()==commentId;
    }

    public void delete(){
        isDelete=true;
    }
}
