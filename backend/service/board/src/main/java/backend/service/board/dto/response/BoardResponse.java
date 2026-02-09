package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardResponse {

    private Long boardId;
    private Long userId;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;


    public static BoardResponse from(BoardEntity boardEntity) {
        BoardResponse boardResponseDto = new BoardResponse();
        boardResponseDto.boardId = boardEntity.getBoardId();
        boardResponseDto.userId=boardEntity.getUserId();
        boardResponseDto.title = boardEntity.getTitle();
        boardResponseDto.content = boardEntity.getContent();
        boardResponseDto.createAt = boardEntity.getCreateAt();
        boardResponseDto.modifiedAt = boardEntity.getModifiedAt();
        return boardResponseDto;
    }
}
