package backend.service.alarm.service;

import backend.common.enumType.AlarmType;
import backend.common.id.Snowflake;
import backend.service.alarm.dto.response.AlarmResponse;
import backend.service.alarm.entity.AlarmEntity;
import backend.service.alarm.repository.AlarmRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmServiceImpl implements AlarmService {

    private final AlarmRepository alarmRepository;
    private final SseEmitterManager sseEmitterManager;
    private final Snowflake snowflake = new Snowflake();

    @Override
    @Transactional
    public void create(Long userId, AlarmType alarmType, String message, Long targetId) {
        AlarmEntity entity = AlarmEntity.create(
                snowflake.nextId(), userId, alarmType, message, targetId
        );
        alarmRepository.save(entity);

        // SSE로 실시간 전송
        sseEmitterManager.send(userId, alarmType.name(), AlarmResponse.from(entity));
        log.info("알림 생성 userId={}, alarmType={}", userId, alarmType);
    }

    @Override
    public List<AlarmResponse> getUnreadAlarms(Long userId) {
        return alarmRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(AlarmResponse::from)
                .toList();
    }

    @Override
    public List<AlarmResponse> getAllAlarms(Long userId) {
        return alarmRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AlarmResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public void read(Long alarmId) {
        AlarmEntity entity = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new RuntimeException("알림이 존재하지 않습니다."));
        entity.read();
    }
    @Override
    @Transactional
    public void readAll(Long userId) {
        List<AlarmEntity> alarms = alarmRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        alarms.forEach(AlarmEntity::read);
    }
}