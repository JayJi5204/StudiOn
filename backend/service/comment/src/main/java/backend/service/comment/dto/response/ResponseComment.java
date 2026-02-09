package backend.service.comment.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseComment {
    private Long commentId;
    private String content;
    private String commentPath;
    private Boolean isDelete;
    private LocalDateTime createAt;
    private Long userId;
    private Long boardId;
}