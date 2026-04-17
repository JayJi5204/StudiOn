package backend.service.comment.feign;

import backend.common.dto.board.GetBoardResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "board-service")
public interface BoardClient {
    @GetMapping("/api/boards/get/{boardId}")
    GetBoardResponse getBoard(@PathVariable Long boardId);
}