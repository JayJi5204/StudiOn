package backend.service.studyGroup.repository;

import backend.common.enumType.MemberStatus;
import backend.service.studyGroup.entity.StudyMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyMemberRepository extends JpaRepository<StudyMemberEntity, Long> {
    List<StudyMemberEntity> findAllByGroupId(Long groupId);
    List<StudyMemberEntity> findAllByGroupIdAndStatus(Long groupId, MemberStatus status);
    List<StudyMemberEntity> findAllByUserIdAndStatus(Long userId, MemberStatus status);
    Optional<StudyMemberEntity> findByGroupIdAndUserId(Long groupId, Long userId);
    boolean existsByGroupIdAndUserIdAndStatus(Long groupId, Long userId, MemberStatus status);
}