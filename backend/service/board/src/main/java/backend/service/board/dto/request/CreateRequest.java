package backend.service.board.dto.request;

import backend.common.enumType.Category;
import lombok.Data;

import java.util.List;

@Data
public class CreateRequest {
    private String title;
    private String content;
    private Category category;
    private List<String> tags;
}
