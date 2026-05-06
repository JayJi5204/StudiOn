package backend.service.studyGroup.dto.request;

import backend.common.enumType.StudyGroupCategory;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateGroupRequest {

    @Schema(example = "알고리즘 스터디")
    @Size(max = 30, message = "그룹명은 30자 이하여야 합니다.")
    private String groupName;

    @Schema(example = "매주 월수금 알고리즘 문제를 풀어요")
    private String description;

    @Schema(example = "JOB")
    private StudyGroupCategory category;

    @Schema(example = "false")
    @JsonProperty("isPrivate")
    private Boolean isPrivate;

    @Schema(example = "MON,WED,FRI")
    private String dayOfWeek;

    @Schema(example = "19:00")
    private String studyTime;

    @Schema(example = "[\"Java\", \"Spring\", \"코테\"]")
    private List<String> tags;
}