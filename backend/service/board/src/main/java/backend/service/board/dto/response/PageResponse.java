package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PageResponse {

    private String boardId;
    private String nickName;
    private String title;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private LocalDateTime createAt;

    public static PageResponse from(BoardEntity boardEntity, Long viewCount, Long likeCount) {
        PageResponse pageResponseDto = new PageResponse();
        pageResponseDto.boardId = String.valueOf(boardEntity.getBoardId());
        pageResponseDto.nickName = boardEntity.getNickName();
        pageResponseDto.title = boardEntity.getTitle();
        pageResponseDto.category = boardEntity.getCategory();
        pageResponseDto.viewCount = viewCount;
        pageResponseDto.likeCount = likeCount;
        pageResponseDto.createAt = boardEntity.getCreateAt();
        return pageResponseDto;
    }
}