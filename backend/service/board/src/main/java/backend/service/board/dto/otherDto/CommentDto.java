package backend.service.board.dto.otherDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String commentId;
    private String content;
    private String commentPath;
    private String boardId;
    private String userId;
    private String nickName;
    private Long likeCount;
    private Boolean isDelete;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}