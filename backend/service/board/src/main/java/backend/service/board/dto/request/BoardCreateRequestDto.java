package backend.service.board.dto.request;

import lombok.Data;

@Data
public class BoardCreateRequestDto {
    private Long boardKey;
    private Long userId;
    private String title;
    private String content;
}
