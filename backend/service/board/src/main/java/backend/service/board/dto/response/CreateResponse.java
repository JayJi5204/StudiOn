package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.common.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateResponse {

    private String boardId;
    private String nickName;
    private String userId;
    private List<String> tags;
    private String title;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private LocalDateTime modifiedAt;
    private LocalDateTime createdAt;

    public static CreateResponse from(BoardEntity entity) {
        CreateResponse dto = new CreateResponse();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.userId = String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.viewCount = entity.getViewCount();
        dto.likeCount = entity.getLikeCount();
        dto.tags = entity.getTags();
        dto.createdAt = entity.getCreatedAt();
        dto.modifiedAt = entity.getModifiedAt();
        return dto;
    }
}
