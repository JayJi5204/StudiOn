package backend.service.studyGroup.dto.request;

import backend.common.enumType.StudyGroupCategory;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateGroupRequest {

    @Schema(example = "알고리즘 스터디")
    @NotBlank(message = "그룹명은 필수입니다.")
    @Size(max = 30, message = "그룹명은 30자 이하여야 합니다.")
    private String groupName;

    @Schema(example = "매주 월수금 알고리즘 문제를 풀어요")
    private String description;

    @Schema(example = "JOB")
    @NotNull(message = "카테고리는 필수입니다.")
    private StudyGroupCategory category;

    @Schema(example = "false")
    @JsonProperty("isPrivate")
    private boolean isPrivate;

    @Schema(example = "MON,WED,FRI")
    private String dayOfWeek;

    @Schema(example = "19:00")
    private String studyTime;

    @Schema(example = "[\"Java\", \"Spring\", \"코테\"]")
    private List<String> tags;
}