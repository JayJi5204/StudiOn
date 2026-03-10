package backend.service.user.dto.otherDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

    private Long boardId;
    private Long commentId;
    private String content;
    private String parentPath;
}