package backend.common.kafkaEvent;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void send(String topic, Object event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            log.info("Kafka publish topic={}, event={}", topic, json);
            kafkaTemplate.send(topic, json);
        } catch (Exception e) {
            log.error("Kafka 직렬화 실패", e);
        }
    }
}