package backend.service.board.dto.request;

import backend.service.board.enumType.Category;
import lombok.Data;

@Data
public class UpdateRequest {
    private String title;
    private String content;
    private Category category;
}
