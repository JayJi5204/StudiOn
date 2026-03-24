package backend.service.board.dto.otherDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String commentId;
    private String content;
    private String parentPath;
}