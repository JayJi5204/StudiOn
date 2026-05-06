package backend.service.groupChat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class GroupChatRoomManager {

    private final RedisMessageListenerContainer container;
    private final GroupChatSubscriber chatSubscriber;
    private final Set<String> subscribedRooms = Collections.newSetFromMap(new ConcurrentHashMap<>());

    // 채팅방 구독
    public void subscribe(String roomId) {
        if (subscribedRooms.contains(roomId)) {
            log.info("이미 구독 중인 채팅방 roomId={}", roomId);
            return;
        }
        container.addMessageListener(chatSubscriber, new PatternTopic("group-chat:room:" + roomId));
        subscribedRooms.add(roomId);
        log.info("채팅방 구독 roomId={}", roomId);
    }

    // 채팅방 구독 해제
    public void unsubscribe(String roomId) {
        container.removeMessageListener(chatSubscriber, new PatternTopic("group-chat:room:" + roomId));
        subscribedRooms.remove(roomId);
        log.info("채팅방 구독 해제 roomId={}", roomId);
    }
}