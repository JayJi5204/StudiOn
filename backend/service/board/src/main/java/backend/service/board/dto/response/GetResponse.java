package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
public class GetResponse {

    private String boardId;
    private String userId;
    private String title;
    private String content;
    private Category category;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;

    public static GetResponse from(BoardEntity entity) {

        GetResponse dto = new GetResponse();

        dto.boardId = String.valueOf(entity.getBoardId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.category = entity.getCategory();
        dto.createAt = entity.getCreateAt();
        dto.modifiedAt = entity.getModifiedAt();

        return dto;
    }
}