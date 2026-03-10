package backend.service.user.dto.otherDto;
import lombok.Getter;

@Getter
public class BoardDto {
    private final Long boardId;
    private final String title;

    public BoardDto(Long boardId, String title) {
        this.boardId = boardId;
        this.title = title;
    }
}