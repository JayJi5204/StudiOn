package backend.service.studyGroup.repository;

import backend.common.enumType.StudyGroupCategory;
import backend.service.studyGroup.entity.StudyGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyGroupRepository extends JpaRepository<StudyGroupEntity, Long> {
    Optional<StudyGroupEntity> findByInviteCode(String inviteCode);
    List<StudyGroupEntity> findAllByOrderByCreatedAtDesc();
    List<StudyGroupEntity> findAllByCategoryOrderByCreatedAtDesc(StudyGroupCategory category);
    List<StudyGroupEntity> findByGroupNameContainingOrderByCreatedAtDesc(String keyword);
    List<StudyGroupEntity> findByCategoryAndGroupNameContainingOrderByCreatedAtDesc(
            StudyGroupCategory category, String keyword);
}