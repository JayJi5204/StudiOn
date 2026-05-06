package backend.service.comment.dto.response;

import lombok.Data;

@Data
public class LikeResponse {
    private Long likeCount;
    private Boolean isLiked;

    public static LikeResponse from(Long likeCount, Boolean isLiked) {
        LikeResponse response = new LikeResponse();
        response.likeCount = likeCount;
        response.isLiked = isLiked;
        return response;
    }
}