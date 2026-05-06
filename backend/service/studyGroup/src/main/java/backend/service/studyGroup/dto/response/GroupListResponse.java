package backend.service.studyGroup.dto.response;

import backend.common.enumType.StudyGroupCategory;
import backend.service.studyGroup.entity.StudyGroupEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GroupListResponse {
    private String groupId;
    private String groupName;
    private String description;
    private StudyGroupCategory category;
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    private int currentMembers;
    private int maxMembers;
    private String dayOfWeek;
    private String studyTime;
    private List<String> tags;

    public static GroupListResponse from(StudyGroupEntity entity) {
        GroupListResponse dto = new GroupListResponse();
        dto.groupId = String.valueOf(entity.getGroupId());
        dto.groupName = entity.getGroupName();
        dto.description = entity.getDescription();
        dto.category = entity.getCategory();
        dto.isPrivate = entity.isPrivate();
        dto.currentMembers = entity.getCurrentMembers();
        dto.maxMembers = entity.getMaxMembers();
        dto.dayOfWeek = entity.getDayOfWeek();
        dto.studyTime = entity.getStudyTime();
        dto.tags = entity.getTags();
        return dto;
    }
}