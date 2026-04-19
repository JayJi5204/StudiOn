package backend.service.user.dto.response;

import lombok.Data;

@Data
public class StudyRankingResponse {
    private String userId;
    private String nickName;
    private Long studyMinutes;
    private Long rank;

    public static StudyRankingResponse from(String userId, String nickName, Long studyMinutes, Long rank) {
        StudyRankingResponse dto = new StudyRankingResponse();
        dto.userId = userId;
        dto.nickName = nickName;
        dto.studyMinutes = studyMinutes;
        dto.rank = rank;
        return dto;
    }
}