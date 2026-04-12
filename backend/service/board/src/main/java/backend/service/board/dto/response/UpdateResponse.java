package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateResponse {

    private String boardId;
    private String nickName;
    private String userId;
    private String title;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private List<String> tags;
    private LocalDateTime modifiedAt;
    private LocalDateTime createdAt;

    public static UpdateResponse from(BoardEntity entity, Long viewCount, Long likeCount) {
        UpdateResponse dto = new UpdateResponse();
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
        return dto;
    }
}
