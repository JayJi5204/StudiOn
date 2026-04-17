package backend.common.kafkaEvent.comment;

public record CommentCreatedEvent(Long boardId, Long boardOwnerId, String commenterNickName) {
}