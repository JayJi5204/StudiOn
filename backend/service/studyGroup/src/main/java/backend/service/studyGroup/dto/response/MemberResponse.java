package backend.service.studyGroup.dto.response;

import backend.common.enumType.MemberStatus;
import backend.service.studyGroup.entity.StudyMemberEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MemberResponse {
    private String memberId;
    private String groupId;
    private String userId;
    private String nickName;
    private MemberStatus status;
    private LocalDateTime joinedAt;

    public static MemberResponse from(StudyMemberEntity entity) {
        MemberResponse dto = new MemberResponse();
        dto.memberId = String.valueOf(entity.getMemberId());
        dto.groupId = String.valueOf(entity.getGroupId());
        dto.userId = String.valueOf(entity.getUserId());
        dto.nickName = entity.getNickName();
        dto.status = entity.getStatus();
        dto.joinedAt = entity.getJoinedAt();
        return dto;
    }
}