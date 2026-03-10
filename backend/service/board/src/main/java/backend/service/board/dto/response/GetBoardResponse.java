package backend.service.board.dto.response;

import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.entity.BoardEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;


@Getter
public class GetBoardResponse {
    private Long userId;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;
    private List<CommentDto> comment;

    public static GetBoardResponse from(BoardEntity entity, List<CommentDto> responseComments) {
        GetBoardResponse dto = new GetBoardResponse();
        dto.userId = entity.getUserId();
        dto.title = entity.getTitle();
        dto.content = entity.getContent();
        dto.createAt = entity.getCreateAt();
        dto.modifiedAt = entity.getModifiedAt();
        dto.comment = responseComments;
        return dto;
    }
}
