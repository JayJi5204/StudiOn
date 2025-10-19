package backend.service.comment.dto.response;

import lombok.Getter;

import java.util.List;

@Getter
public class CommentPageResponse {

    private List<CommentResponseDto> comments;
    private Long commentCount;

    public static CommentPageResponse of(List<CommentResponseDto> comments, Long commentCount) {
        CommentPageResponse response = new CommentPageResponse();
        response.comments = comments;
        response.commentCount = commentCount;
        return response;
    }
}
