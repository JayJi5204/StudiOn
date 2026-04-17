package backend.service.alarm.controller;

import backend.service.alarm.dto.response.AlarmResponse;
import backend.service.alarm.service.AlarmService;
import backend.service.alarm.service.SseEmitterManager;
import backend.service.alarm.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Tag(name = "Alarm", description = "알림 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alarms")
public class AlarmController {

    private final AlarmService alarmService;
    private final SseEmitterManager sseEmitterManager;

    @Operation(summary = "알림 구독", description = "SSE 연결을 통해 실시간 알림을 구독합니다.")
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
            @Parameter(description = "구독할 유저 ID") @PathVariable Long userId) {
        return sseEmitterManager.subscribe(userId);
    }

    @Operation(summary = "읽지 않은 알림 조회", description = "읽지 않은 알림 목록을 조회합니다.")
    @GetMapping("/unread")
    public List<AlarmResponse> getUnreadAlarms(HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return alarmService.getUnreadAlarms(userId);
    }

    @Operation(summary = "전체 알림 조회", description = "전체 알림 목록을 조회합니다.")
    @GetMapping("/list")
    public List<AlarmResponse> getAllAlarms(HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return alarmService.getAllAlarms(userId);
    }

    @Operation(summary = "알림 읽음 처리", description = "알림을 읽음 처리합니다.")
    @PatchMapping("/{alarmId}/read")
    public void read(
            @Parameter(description = "알림 ID") @PathVariable Long alarmId) {
        alarmService.read(alarmId);
    }

    @Operation(summary = "전체 알림 읽음 처리", description = "모든 알림을 읽음 처리합니다.")
    @PatchMapping("/read-all")
    public void readAll(HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        alarmService.readAll(userId);
    }
}