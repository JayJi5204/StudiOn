package backend.common.kafkaEvent.ranking;


public record StudyTimeEvent(Long userId, Long studyMinutes, String date) {

}