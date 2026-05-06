package backend.service.user.dto.response;

import lombok.Data;

@Data
public class StudyRankingResponse {
    private String userId;
    private String nickName;
    private Long studyTime;
    private Long rank;

    public static StudyRankingResponse from(String userId, String nickName, Long studyTime, Long rank) {
        StudyRankingResponse dto = new StudyRankingResponse();
        dto.userId = userId;
        dto.nickName = nickName;
        dto.studyTime = studyTime;
        dto.rank = rank;
        return dto;
    }
}