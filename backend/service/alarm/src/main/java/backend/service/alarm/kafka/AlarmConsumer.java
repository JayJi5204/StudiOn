package backend.service.alarm.kafka;

import backend.common.enumType.AlarmType;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.service.alarm.service.AlarmService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlarmConsumer {

    private final AlarmService alarmService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "alarm", groupId = "${spring.application.name}-group")
    public void consume(String message) {
        try {
            AlarmEvent event = objectMapper.readValue(message, AlarmEvent.class);
            alarmService.create(
                    event.userId(),
                    AlarmType.valueOf(event.alarmType()),
                    event.message(),
                    event.targetId()
            );
            log.info("알림 처리 완료 userId={}, alarmType={}", event.userId(), event.alarmType());
        } catch (Exception e) {
            log.error("알림 처리 실패", e);
        }
    }
}