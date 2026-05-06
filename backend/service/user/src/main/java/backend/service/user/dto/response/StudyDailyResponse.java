package backend.service.user.dto.response;

import lombok.Data;

@Data
public class StudyDailyResponse {
    private String date;
    private Long studyMinutes;

    public static StudyDailyResponse from(String date, Long studyMinutes) {
        StudyDailyResponse dto = new StudyDailyResponse();
        dto.date = date;
        dto.studyMinutes = studyMinutes;
        return dto;
    }
}