package backend.common.dto.board;

import java.time.LocalDateTime;

public record BoardDeleteEvent(Long boardId, LocalDateTime deletedAt) {
}