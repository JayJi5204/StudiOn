package backend.common.kafkaDto.board;

import java.time.LocalDateTime;

public record BoardDeleteEvent(Long boardId, LocalDateTime deletedAt) {
}