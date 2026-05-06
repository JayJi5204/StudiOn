package backend.service.chat.repository;

import backend.service.chat.entity.ChatEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // 내가 참여한 채팅방 목록 (가장 최근 메시지만)
    @Query("SELECT c FROM ChatEntity c WHERE (c.roomId LIKE :prefix OR c.roomId LIKE :suffix) AND c.sendAt = (SELECT MAX(c2.sendAt) FROM ChatEntity c2 WHERE c2.roomId = c.roomId)")
    List<ChatEntity> findMyLatestMessages(
            @Param("prefix") String prefix,
            @Param("suffix") String suffix
    );
}