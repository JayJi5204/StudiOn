package backend.service.comment.util;


import backend.service.comment.repository.CommentRepository;
import backend.service.comment.service.CommentCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommentCountSyncScheduler {

    private final CommentRepository commentRepository;
    private final CommentCountService commentCountService;
    private final RedisTemplate<String, Long> redisTemplate;

    @Scheduled(fixedDelay = 60000)
    public void syncCountsToDB() {
        log.info("Comment 카운트 DB 동기화 시작");

        Set<String> likeKeys = redisTemplate.keys("comment:like:*");
        if (likeKeys == null) return;

        for (String key : likeKeys) {
            // comment:like:set: 키는 제외
            if (key.contains("set")) continue;

            Long commentId = Long.parseLong(key.replace("comment:like:", ""));
            Long likeCount = commentCountService.getLikeCount(commentId);

            commentRepository.findById(commentId).ifPresent(comment -> {
                comment.syncLikeCount(likeCount);
                commentRepository.save(comment);
            });
        }

        log.info("Comment 카운트 DB 동기화 완료");
    }
}