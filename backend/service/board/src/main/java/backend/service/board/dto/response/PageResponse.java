package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PageResponse {

    private String boardId;
    private String userId;
    private String title;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private LocalDateTime createAt;

    public static PageResponse from(BoardEntity boardEntity) {

        PageResponse pageResponseDto = new PageResponse();

        pageResponseDto.boardId = String.valueOf(boardEntity.getBoardId());
        pageResponseDto.userId = String.valueOf(boardEntity.getUserId());
        pageResponseDto.title = boardEntity.getTitle();
        pageResponseDto.category = boardEntity.getCategory();
        pageResponseDto.viewCount = boardEntity.getViewCount();
        pageResponseDto.likeCount = boardEntity.getLikeCount();
        pageResponseDto.createAt = boardEntity.getCreateAt();

        return pageResponseDto;
    }
}