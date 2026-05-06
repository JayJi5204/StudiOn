package backend.service.comment.dto.other;

import lombok.Data;

@Data
public class GetBoardResponse {
    private String boardId;
    private String userId;
    private String nickName;
}