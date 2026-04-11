package backend.service.board.feign;

import backend.service.board.dto.otherDto.CommentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {

    @GetMapping("/api/comments/getCommentWithBoardId/{boardId}")
    List<CommentDto> getComments(@PathVariable Long boardId);

}