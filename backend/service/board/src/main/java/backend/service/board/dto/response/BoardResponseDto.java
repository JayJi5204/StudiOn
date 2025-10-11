package backend.service.board.dto.response;

import backend.service.board.entity.BoardEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardResponseDto {

    private Long boardId;
    private Long boardKey;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;


    public static BoardResponseDto from(BoardEntity boardEntity) {
        BoardResponseDto boardResponseDto = new BoardResponseDto();
        boardResponseDto.boardId = boardEntity.getBoardId();
        boardResponseDto.boardKey = boardEntity.getBoardKey();
        boardResponseDto.title = boardEntity.getTitle();
        boardResponseDto.content = boardEntity.getContent();
        boardResponseDto.createAt = boardEntity.getCreateAt();
        boardResponseDto.modifiedAt = boardEntity.getModifiedAt();
        return boardResponseDto;
    }
}
