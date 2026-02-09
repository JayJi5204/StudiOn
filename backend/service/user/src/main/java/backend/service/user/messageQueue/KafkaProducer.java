package backend.service.user.messageQueue;

import backend.service.user.dto.kafka.KafkaUserDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
@Service
@Log4j2
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void send(String topic, KafkaUserDto kafkaUserDto) {
        try {
            String jsonInString = objectMapper.writeValueAsString(kafkaUserDto);
            kafkaTemplate.send(topic, jsonInString);

            log.info("Kafka message sent to topic [{}]: {}", topic, jsonInString);

        } catch (JsonProcessingException e) {
            log.error("JSON mapping error for DTO: {}", kafkaUserDto, e);
        }
    }
}