package backend.service.studyGroup.entity;

import backend.common.converter.StringListConverter;
import backend.common.enumType.StudyGroupCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "study_groups")
@Getter
@NoArgsConstructor
public class StudyGroupEntity {

    @Id
    private Long groupId;

    @Column(nullable = false)
    private String groupName;

    @Column
    private String description;

    @Column(nullable = false)
    private Long leaderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudyGroupCategory category;

    @Column(nullable = false)
    private boolean isPrivate;

    @Column
    private String inviteCode;

    @Column(nullable = false)
    private int maxMembers;

    @Column(nullable = false)
    private int currentMembers;

    @Column
    private String dayOfWeek;

    @Column
    private String studyTime;

    @Convert(converter = StringListConverter.class)
    private List<String> tags;

    private LocalDateTime createdAt;

    public static StudyGroupEntity create(Long groupId, String groupName, String description,
                                          Long leaderId, StudyGroupCategory category, boolean isPrivate,
                                          String inviteCode, String dayOfWeek, String studyTime,
                                          List<String> tags) {
        StudyGroupEntity entity = new StudyGroupEntity();
        entity.groupId = groupId;
        entity.groupName = groupName;
        entity.description = description;
        entity.leaderId = leaderId;
        entity.category = category;
        entity.isPrivate = isPrivate;
        entity.inviteCode = inviteCode;
        entity.maxMembers = 4;
        entity.currentMembers = 1;
        entity.dayOfWeek = dayOfWeek;
        entity.studyTime = studyTime;
        entity.tags = tags != null ? tags : List.of();
        entity.createdAt = LocalDateTime.now();
        return entity;
    }

    public void update(String groupName, String description, StudyGroupCategory category,
                       String dayOfWeek, String studyTime, List<String> tags,Boolean isPrivate) {
        if (groupName != null) this.groupName = groupName;
        if (description != null) this.description = description;
        if (category != null) this.category = category;
        if (dayOfWeek != null) this.dayOfWeek = dayOfWeek;
        if (studyTime != null) this.studyTime = studyTime;
        if (tags != null) this.tags = tags;
        if (isPrivate != null) this.isPrivate = isPrivate;
    }

    public void increaseMembers() { this.currentMembers++; }
    public void decreaseMembers() { if (this.currentMembers > 0) this.currentMembers--; }
    public void changeLeader(Long newLeaderId) { this.leaderId = newLeaderId; }
}