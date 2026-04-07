package backend.service.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatRoomManager {

    private final RedisMessageListenerContainer container;
    private final ChatSubscriber chatSubscriber;

    // 채팅방 구독
    public void subscribe(String roomId) {
        container.addMessageListener(chatSubscriber, new PatternTopic("chat:room:" + roomId));
        log.info("채팅방 구독 roomId={}", roomId);
    }

    // 채팅방 구독 해제
    public void unsubscribe(String roomId) {
        container.removeMessageListener(chatSubscriber, new PatternTopic("chat:room:" + roomId));
        log.info("채팅방 구독 해제 roomId={}", roomId);
    }
}