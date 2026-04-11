package backend.common.event.board;

import java.time.LocalDateTime;

public record BoardDeleteEvent(Long boardId, LocalDateTime deletedAt) {
}