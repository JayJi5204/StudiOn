package backend.service.board.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.service.board.dto.response.LikeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BoardCountService {

    private final RedisTemplate<String, Long> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    private static final String VIEW_COUNT_KEY = "board:view:";
    private static final String LIKE_COUNT_KEY = "board:like:";
    private static final String LIKE_SET_KEY = "board:like:set:";
    private static final String COMMENT_COUNT_KEY = "board:comment:count:";
    private static final String VIEW_RANKING_KEY = "ranking:board:view";  // 추가
    private static final String LIKE_RANKING_KEY = "ranking:board:like";  // 추가

    public Long incrementViewCount(Long boardId) {
        Long count = redisTemplate.opsForValue().increment(VIEW_COUNT_KEY + boardId);
        stringRedisTemplate.opsForZSet().incrementScore(VIEW_RANKING_KEY, String.valueOf(boardId), 1);
        return count;
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
            throw new CustomException(ErrorCode.ALREADY_LIKED);
        }

        stringRedisTemplate.opsForSet().add(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().increment(LIKE_COUNT_KEY + boardId);
        stringRedisTemplate.opsForZSet().incrementScore(LIKE_RANKING_KEY, String.valueOf(boardId), 1);

        return LikeResponse.from(likeCount, true);
    }

    public LikeResponse unlike(Long boardId, Long userId) {
        String setKey = LIKE_SET_KEY + boardId;

        Boolean isLiked = stringRedisTemplate.opsForSet()
                .isMember(setKey, String.valueOf(userId));

        if (Boolean.FALSE.equals(isLiked)) {
            throw new CustomException(ErrorCode.NOT_LIKED);
        }

        stringRedisTemplate.opsForSet().remove(setKey, String.valueOf(userId));
        Long likeCount = redisTemplate.opsForValue().decrement(LIKE_COUNT_KEY + boardId);
        stringRedisTemplate.opsForZSet().incrementScore(LIKE_RANKING_KEY, String.valueOf(boardId), -1);

        return LikeResponse.from(likeCount, false);
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

    public List<String> getViewRanking(int top) {
        Set<String> ranking = stringRedisTemplate.opsForZSet()
                .reverseRange(VIEW_RANKING_KEY, 0, top - 1);
        return ranking != null ? new ArrayList<>(ranking) : List.of();
    }

    public List<String> getLikeRanking(int top) {
        Set<String> ranking = stringRedisTemplate.opsForZSet()
                .reverseRange(LIKE_RANKING_KEY, 0, top - 1);
        return ranking != null ? new ArrayList<>(ranking) : List.of();
    }
}