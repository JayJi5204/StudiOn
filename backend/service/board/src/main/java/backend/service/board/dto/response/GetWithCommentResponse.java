package backend.service.board.dto.response;

import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GetWithCommentResponse {

    private String boardId;
    private String nickName;
    private String title;
    private String userId;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private List<CommentDto> comment;

    public static GetWithCommentResponse from(BoardEntity entity, List<CommentDto> responseComments, Long viewCount, Long likeCount) {
        GetWithCommentResponse dto = new GetWithCommentResponse();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.userId=String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.viewCount = viewCount;
        dto.likeCount = likeCount;
        dto.tags = entity.getTags();
        dto.createdAt = entity.getCreatedAt();
        dto.modifiedAt = entity.getModifiedAt();
        dto.comment = responseComments;
        return dto;
    }
}
