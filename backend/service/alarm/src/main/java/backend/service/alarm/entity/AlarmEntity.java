package backend.service.alarm.entity;

import backend.common.enumType.AlarmType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Table(name = "alarms")
@Getter
@NoArgsConstructor
public class AlarmEntity {

    @Id
    private Long alarmId;

    private Long userId;        // 알림 받을 유저

    @Enumerated(EnumType.STRING)
    private AlarmType alarmType;

    private String message;

    private Long targetId;      // 관련 ID (boardId, roomId, chatId 등)

    private Boolean isRead;

    private String createdAt;

    public static AlarmEntity create(Long alarmId, Long userId, AlarmType alarmType, String message, Long targetId) {
        AlarmEntity entity = new AlarmEntity();
        entity.alarmId = alarmId;
        entity.userId = userId;
        entity.alarmType = alarmType;
        entity.message = message;
        entity.targetId = targetId;
        entity.isRead = false;
        entity.createdAt = LocalDateTime.now().toString();
        return entity;
    }

    public void read() {
        this.isRead = true;
    }
}