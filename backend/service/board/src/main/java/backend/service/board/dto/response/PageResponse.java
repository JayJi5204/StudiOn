package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PageResponse {

    private String boardId;
    private String nickName;
    private String title;
    private Category category;
    private String content;
    private List<String> tags;
    private Long viewCount;
    private Long  likeCount;
    private LocalDateTime createdAt;

    public static PageResponse from(BoardEntity boardEntity, Long viewCount, Long likeCount) {
        PageResponse pageResponseDto = new PageResponse();
        pageResponseDto.boardId = String.valueOf(boardEntity.getBoardId());
        pageResponseDto.nickName = boardEntity.getNickName();
        pageResponseDto.title = boardEntity.getTitle();
        pageResponseDto.content = boardEntity.getContent();
        pageResponseDto.category = boardEntity.getCategory();
        pageResponseDto.tags = boardEntity.getTags();
        pageResponseDto.viewCount = viewCount;
        pageResponseDto.likeCount = likeCount;
        pageResponseDto.createdAt = boardEntity.getCreatedAt();
        return pageResponseDto;
    }
}