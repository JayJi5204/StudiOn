package backend.service.studyGroup.entity;

import backend.common.enumType.MemberStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_members")
@Getter
@NoArgsConstructor
public class StudyMemberEntity {

    @Id
    private Long memberId;

    @Column(nullable = false)
    private Long groupId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String nickName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status;

    private LocalDateTime joinedAt;

    public static StudyMemberEntity create(Long memberId, Long groupId, Long userId, String nickName) {
        StudyMemberEntity entity = new StudyMemberEntity();
        entity.memberId = memberId;
        entity.groupId = groupId;
        entity.userId = userId;
        entity.nickName = nickName;
        entity.status = MemberStatus.PENDING;
        entity.joinedAt = LocalDateTime.now();
        return entity;
    }

    public void accept() { this.status = MemberStatus.ACCEPTED; }
    public void reject() { this.status = MemberStatus.REJECTED; }
}