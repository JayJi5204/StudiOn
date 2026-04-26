package backend.service.alarm.dto.response;

import backend.common.enumType.AlarmType;
import backend.service.alarm.entity.AlarmEntity;
import lombok.Data;

@Data
public class AlarmResponse {
    private String alarmId;
    private String userId;
    private AlarmType alarmType;
    private String message;
    private String targetId;
    private Boolean isRead;
    private String createdAt;

    public static AlarmResponse from(AlarmEntity entity) {
        AlarmResponse dto = new AlarmResponse();
        dto.alarmId = String.valueOf(entity.getAlarmId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.alarmType = entity.getAlarmType();
        dto.message = entity.getMessage();
        dto.targetId = String.valueOf(entity.getTargetId());
        dto.isRead = entity.getIsRead();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }
}