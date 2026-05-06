package backend.service.comment.util;

import backend.service.comment.entity.CommentEntity;
import backend.service.comment.repository.CommentRepository;
import backend.service.comment.service.CommentCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
class CommentCountInitializer implements ApplicationRunner {

    private final CommentRepository commentRepository;
    private final RedisTemplate<String, Long> redisTemplate;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Comment Redis 카운트 초기화 시작");

        List<CommentEntity> comments = commentRepository.findAll();

        for (CommentEntity comment : comments) {
            String likeKey = "comment:like:" + comment.getCommentId();
            if (redisTemplate.opsForValue().get(likeKey) == null) {
                redisTemplate.opsForValue().set(likeKey, comment.getLikeCount());
            }
        }

        log.info("Comment Redis 카운트 초기화 완료");
    }
}
