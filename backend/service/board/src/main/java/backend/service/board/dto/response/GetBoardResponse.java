package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
public class GetBoardResponse {

    private String boardId;
    private String userId;
    private String title;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private LocalDateTime modifiedAt;
    private LocalDateTime createAt;

    public static GetBoardResponse from(BoardEntity entity) {

        GetBoardResponse dto = new GetBoardResponse();

        dto.boardId = String.valueOf(entity.getBoardId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.viewCount = entity.getViewCount();
        dto.likeCount = entity.getLikeCount();
        dto.createAt = entity.getCreateAt();
        dto.modifiedAt = entity.getModifiedAt();

        return dto;
    }
}