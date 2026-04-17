package backend.service.alarm.repository;

import backend.service.alarm.entity.AlarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmRepository extends JpaRepository<AlarmEntity, Long> {
    List<AlarmEntity> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    List<AlarmEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
}