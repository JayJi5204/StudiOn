package backend.service.room.repository;

import backend.service.room.entity.RoomEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity,Long> {
    Optional<RoomEntity> findByInviteCode(String inviteCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RoomEntity r WHERE r.roomId = :roomId")
    Optional<RoomEntity> findByIdWithLock(Long roomId);

    List<RoomEntity> findByRoomNameContaining(String keyword);
}

