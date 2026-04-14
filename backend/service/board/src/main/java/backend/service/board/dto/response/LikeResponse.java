package backend.service.board.dto.response;

import lombok.Data;

@Data
public class LikeResponse {
    private Long likeCount;
    private boolean isLiked;

    public static LikeResponse from(Long likeCount, boolean isLiked) {
        LikeResponse response = new LikeResponse();
        response.likeCount = likeCount;
        response.isLiked = isLiked;
        return response;
    }
}