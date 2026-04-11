package backend.service.chat.repository;

import backend.service.chat.entity.ChatEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Long> {

    // 채팅방 메시지 조회 (최신순)
    List<ChatEntity> findByRoomIdOrderBySendAtDesc(String roomId, Pageable pageable);

    // 특정 시간 이전 메시지 조회 (무한 스크롤)
    List<ChatEntity> findByRoomIdAndSendAtBeforeOrderBySendAtDesc(String roomId, LocalDateTime sendAt, Pageable pageable);

    long countByRoomId(String roomId);
}