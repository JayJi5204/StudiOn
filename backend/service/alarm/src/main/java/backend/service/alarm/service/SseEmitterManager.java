package backend.service.alarm.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class SseEmitterManager {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("SSE 연결 종료 userId={}", userId);
        });

        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.info("SSE 연결 타임아웃 userId={}", userId);
        });

        emitter.onError(e -> {
            emitters.remove(userId);
            log.error("SSE 연결 오류 userId={}", userId);
        });

        // 연결 확인용 더미 이벤트
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("연결되었습니다"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        log.info("SSE 연결 userId={}", userId);
        return emitter;
    }

    public void send(Long userId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                emitters.remove(userId);
                log.error("SSE 전송 실패 userId={}", userId);
            }
        }
    }
}