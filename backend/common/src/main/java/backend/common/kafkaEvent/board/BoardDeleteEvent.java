package backend.common.kafkaEvent.board;

import java.time.LocalDateTime;

public record BoardDeleteEvent(Long boardId, LocalDateTime deletedAt) {
}