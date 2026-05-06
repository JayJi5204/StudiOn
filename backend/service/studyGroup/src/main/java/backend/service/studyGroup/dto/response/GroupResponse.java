package backend.service.studyGroup.dto.response;

import backend.common.enumType.StudyGroupCategory;
import backend.service.studyGroup.entity.StudyGroupEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GroupResponse {
    private String groupId;
    private String groupName;
    private String description;
    private String leaderId;
    private StudyGroupCategory category;
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    private String inviteCode;
    private int maxMembers;
    private int currentMembers;
    private String dayOfWeek;
    private String studyTime;
    private List<String> tags;
    private LocalDateTime createdAt;

    public static GroupResponse from(StudyGroupEntity entity) {
        GroupResponse dto = new GroupResponse();
        dto.groupId = String.valueOf(entity.getGroupId());
        dto.groupName = entity.getGroupName();
        dto.description = entity.getDescription();
        dto.leaderId = String.valueOf(entity.getLeaderId());
        dto.category = entity.getCategory();
        dto.isPrivate = entity.isPrivate();
        dto.inviteCode = entity.getInviteCode();
        dto.maxMembers = entity.getMaxMembers();
        dto.currentMembers = entity.getCurrentMembers();
        dto.dayOfWeek = entity.getDayOfWeek();
        dto.studyTime = entity.getStudyTime();
        dto.tags = entity.getTags();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }
}