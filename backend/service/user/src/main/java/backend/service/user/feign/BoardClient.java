package backend.service.user.feign;

import backend.service.user.dto.other.BoardDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "board-service")
public interface BoardClient {

    @GetMapping("/api/boards/users/{userId}")
    List<BoardDto> getBoards(@PathVariable Long userId);

}