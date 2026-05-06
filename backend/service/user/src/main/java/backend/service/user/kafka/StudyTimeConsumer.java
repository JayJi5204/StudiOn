package backend.service.user.kafka;

import backend.common.kafkaEvent.ranking.StudyTimeEvent;
import backend.service.user.entity.UserEntity;
import backend.service.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StudyTimeConsumer {

    private final UserRepository userRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    private static final String STUDY_RANKING_KEY = "ranking:study";
    private static final String STUDY_DAILY_KEY = "study:daily:";

    @KafkaListener(topics = "study.time", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            StudyTimeEvent event = objectMapper.readValue(message, StudyTimeEvent.class);

            // UserEntity studyTime 업데이트
            UserEntity entity = userRepository.findByUserId(event.userId());
            if (entity != null) {
                entity.addStudyTime(event.studyMinutes());
                userRepository.save(entity);
            }

            // Redis 랭킹 업데이트
            stringRedisTemplate.opsForZSet().incrementScore(
                    STUDY_RANKING_KEY,
                    String.valueOf(event.userId()),
                    event.studyMinutes()
            );

            // 날짜별 공부시간 업데이트
            stringRedisTemplate.opsForValue().increment(
                    STUDY_DAILY_KEY + event.userId() + ":" + event.date(),
                    event.studyMinutes()
            );

            log.info("공부시간 처리 완료 userId={}, minutes={}", event.userId(), event.studyMinutes());
        } catch (Exception e) {
            log.error("공부시간 처리 실패", e);
        }
    }
}