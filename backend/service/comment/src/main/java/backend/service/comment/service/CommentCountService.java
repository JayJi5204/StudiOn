package backend.service.comment.service;

import backend.service.comment.dto.response.LikeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentCountService {

    private final RedisTemplate<String, Long> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    private static final String LIKE_COUNT_KEY = "comment:like:";
    private static final String LIKE_SET_KEY = "comment:like:set:";

    public Long getLikeCount(Long commentId) {
        Long count = redisTemplate.opsForValue().get(LIKE_COUNT_KEY + commentId);
        return count != null ? count : 0L;
    }

    public LikeResponse like(Long commentId, Long userId) {
        String setKey = LIKE_SET_KEY + commentId;

        Boolean isAlreadyLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.TRUE.equals(isAlreadyLiked)) {
            throw new RuntimeException("이미 좋아요한 댓글입니다.");
        }

        stringRedisTemplate.opsForSet().add(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().increment(LIKE_COUNT_KEY + commentId);
        return LikeResponse.from(likeCount, true);
    }

    public LikeResponse unlike(Long commentId, Long userId) {
        String setKey = LIKE_SET_KEY + commentId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.FALSE.equals(isLiked)) {
            throw new RuntimeException("좋아요하지 않은 댓글입니다.");
        }

        stringRedisTemplate.opsForSet().remove(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().decrement(LIKE_COUNT_KEY + commentId);
        return LikeResponse.from(likeCount, false);
    }

    public boolean isLiked(Long commentId, Long userId) {
        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(LIKE_SET_KEY + commentId, String.valueOf(userId));
        return Boolean.TRUE.equals(isLiked);
    }
}