package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import backend.service.comment.dto.response.ResponseComment;
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
    private List<ResponseComment> comment;

    public static GetBoardResponse from(BoardEntity entity, List<ResponseComment> responseComments) {
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
