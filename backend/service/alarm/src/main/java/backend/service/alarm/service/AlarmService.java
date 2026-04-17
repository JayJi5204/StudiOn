package backend.service.alarm.service;


import backend.common.enumType.AlarmType;
import backend.service.alarm.dto.response.AlarmResponse;

import java.util.List;

public interface AlarmService {
    void create(Long userId, AlarmType alarmType, String message, Long targetId);
    List<AlarmResponse> getUnreadAlarms(Long userId);
    List<AlarmResponse> getAllAlarms(Long userId);
    void read(Long alarmId);
    void readAll(Long userId);
}