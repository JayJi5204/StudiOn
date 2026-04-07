package backend.service.room.repository;

import backend.service.room.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity,Long> {
    Optional<RoomEntity> findByInviteCode(String inviteCode);
}
