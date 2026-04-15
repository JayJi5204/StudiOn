package backend.service.board.service;

import backend.service.board.dto.response.LikeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardCountService {

    private final RedisTemplate<String, Long> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    private static final String VIEW_COUNT_KEY = "board:view:";
    private static final String LIKE_COUNT_KEY = "board:like:";
    private static final String LIKE_SET_KEY = "board:like:set:";
    private static final String COMMENT_COUNT_KEY = "board:comment:count:";

    public Long incrementViewCount(Long boardId) {
        return redisTemplate.opsForValue().increment(VIEW_COUNT_KEY + boardId);
    }

    public Long getViewCount(Long boardId) {
        Long count = redisTemplate.opsForValue().get(VIEW_COUNT_KEY + boardId);
        return count != null ? count : 0L;
    }

    public Long getLikeCount(Long boardId) {
        Long count = redisTemplate.opsForValue().get(LIKE_COUNT_KEY + boardId);
        return count != null ? count : 0L;
    }

    public LikeResponse like(Long boardId, Long userId) {
        String setKey = LIKE_SET_KEY + boardId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.TRUE.equals(isLiked)) {
            throw new RuntimeException("이미 좋아요한 게시글입니다.");
        }

        stringRedisTemplate.opsForSet().add(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().increment(LIKE_COUNT_KEY + boardId);

        return LikeResponse.from(likeCount,true);
    }

    public LikeResponse unlike(Long boardId, Long userId) {
        String setKey = LIKE_SET_KEY + boardId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.FALSE.equals(isLiked)) {
            throw new RuntimeException("좋아요하지 않은 게시글입니다.");
        }

        stringRedisTemplate.opsForSet().remove(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().decrement(LIKE_COUNT_KEY + boardId);

        return LikeResponse.from(likeCount,false);
    }

    public boolean isLiked(Long boardId, Long userId) {
        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(LIKE_SET_KEY + boardId, String.valueOf(userId));
        return Boolean.TRUE.equals(isLiked);
    }

    public Long getCommentCount(Long boardId) {
        String count = stringRedisTemplate.opsForValue().get(COMMENT_COUNT_KEY + boardId);
        return count != null ? Long.parseLong(count) : 0L;
    }

    public void incrementCommentCount(Long boardId) {
        stringRedisTemplate.opsForValue().increment(COMMENT_COUNT_KEY + boardId);
    }

    public void decrementCommentCount(Long boardId) {
        stringRedisTemplate.opsForValue().decrement(COMMENT_COUNT_KEY + boardId);
    }
}