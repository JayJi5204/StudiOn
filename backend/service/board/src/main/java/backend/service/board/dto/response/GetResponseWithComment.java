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
    private String nickName;
    private String title;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private List<String> tags;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;
    private List<CommentDto> comment;

    public static GetResponseWithComment from(BoardEntity entity, List<CommentDto> responseComments, Long viewCount, Long likeCount) {
        GetResponseWithComment dto = new GetResponseWithComment();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.viewCount = viewCount;
        dto.likeCount = likeCount;
        dto.tags = entity.getTags();
        dto.createAt = entity.getCreateAt();
        dto.modifiedAt = entity.getModifiedAt();
        dto.comment = responseComments;
        return dto;
    }
}
