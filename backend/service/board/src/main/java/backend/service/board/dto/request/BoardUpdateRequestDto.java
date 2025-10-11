package backend.service.board.dto.request;

import lombok.Data;

@Data
public class BoardUpdateRequestDto {
    private String title;
    private String content;
}
