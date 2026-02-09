package backend.service.board.dto.request;

import lombok.Data;

@Data
public class BoardCreateRequestDto {
    private Long userId;
    private String title;
    private String content;
}
