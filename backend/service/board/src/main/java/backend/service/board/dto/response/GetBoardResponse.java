package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.common.enumType.BoardCategory;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class GetBoardResponse {

    private String boardId;
    private String nickName;
    private String userId;
    private String title;
    private String content;
    private BoardCategory boardCategory;
    private Long viewCount;
    private Long  likeCount;
    private List<String> tags;
    private LocalDateTime modifiedAt;
    private LocalDateTime createdAt;

    public static GetBoardResponse from(BoardEntity entity, Long viewCount, Long likeCount) {
        GetBoardResponse dto = new GetBoardResponse();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.nickName = entity.getNickName();
        dto.userId=String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.boardCategory = entity.getBoardCategory();
        dto.viewCount = viewCount;
        dto.likeCount = likeCount;
        dto.tags = entity.getTags();
        dto.createdAt = entity.getCreatedAt();
        dto.modifiedAt = entity.getModifiedAt();
        return dto;
    }
}