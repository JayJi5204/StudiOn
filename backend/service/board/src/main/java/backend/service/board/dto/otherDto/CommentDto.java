package backend.service.board.dto.otherDto;

import lombok.Getter;

@Getter
public class CommentDto {
    private final Long commentId;
    private final String content;

    public CommentDto(Long commentId, String content) {
        this.commentId = commentId;
        this.content = content;
    }
}