package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import lombok.Data;

@Data
public class RankingResponse {
    private String boardId;
    private String title;
    private String nickName;
    private String userId;
    private Long count;
    private Long rank;

    public static RankingResponse from(BoardEntity entity, Long count, Long rank) {
        RankingResponse dto = new RankingResponse();
        dto.boardId = String.valueOf(entity.getBoardId());
        dto.title = entity.getTitle();
        dto.nickName = entity.getNickName();
        dto.userId = String.valueOf(entity.getUserId());
        dto.count = count;
        dto.rank = rank;
        return dto;
    }
}