package backend.service.user.dto.otherDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import backend.common.enumType.Category;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardDto {

    private String boardId;
    private String title;
    private String content;
    private Category category;
    private Long viewCount;
    private Long  likeCount;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

}