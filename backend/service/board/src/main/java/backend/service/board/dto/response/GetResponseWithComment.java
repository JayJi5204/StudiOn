package backend.service.board.dto.response;

import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GetResponseWithComment {

    private String boardId;
    private String userId;
    private String title;
    private String content;
    private Category category;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;
    private List<CommentDto> comment;

    public static GetResponseWithComment from(BoardEntity entity, List<CommentDto> responseComments) {

        GetResponseWithComment dto = new GetResponseWithComment();

        dto.boardId = String.valueOf(entity.getBoardId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.createAt = entity.getCreateAt();
        dto.modifiedAt = entity.getModifiedAt();
        dto.comment = responseComments;

        return dto;
    }
}
