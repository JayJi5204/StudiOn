package backend.common.kafkaEvent.alarm;

public record AlarmEvent(
        Long userId,        // 알림 받을 유저
        String alarmType,   // COMMENT, CHAT, ROOM_INVITE
        String message,     // 알림 내용
        Long targetId       // 관련 ID
) {}