package backend.service.user.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseBoard {
    private Long boardKey;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;
}
