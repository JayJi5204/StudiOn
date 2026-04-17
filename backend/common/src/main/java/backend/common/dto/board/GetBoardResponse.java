package backend.common.dto.board;

import lombok.Data;

@Data
public class GetBoardResponse {
    private String boardId;
    private String userId;
    private String nickName;
}