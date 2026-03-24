package backend.service.user.dto.otherDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardDto {

    private String boardId;
    private String title;
    private String content;

}