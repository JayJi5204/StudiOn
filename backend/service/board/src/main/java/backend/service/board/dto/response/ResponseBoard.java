package backend.service.board.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseBoard {
    private Long boardId;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;
}
