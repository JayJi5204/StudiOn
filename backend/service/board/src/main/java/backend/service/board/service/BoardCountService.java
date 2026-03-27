package backend.service.board.service;

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

    public Long like(Long boardId, Long userId) {
        String setKey = LIKE_SET_KEY + boardId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.TRUE.equals(isLiked)) {
            throw new RuntimeException("이미 좋아요한 게시글입니다.");
        }

        stringRedisTemplate.opsForSet().add(setKey, String.valueOf(userId));
        return redisTemplate.opsForValue().increment(LIKE_COUNT_KEY + boardId);
    }

    public Long unlike(Long boardId, Long userId) {
        String setKey = LIKE_SET_KEY + boardId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.FALSE.equals(isLiked)) {
            throw new RuntimeException("좋아요하지 않은 게시글입니다.");
        }

        stringRedisTemplate.opsForSet().remove(setKey, String.valueOf(userId));
        return redisTemplate.opsForValue().decrement(LIKE_COUNT_KEY + boardId);
    }
}