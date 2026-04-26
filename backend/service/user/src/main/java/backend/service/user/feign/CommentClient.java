package backend.service.user.feign;

import backend.service.user.dto.other.CommentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {

    @GetMapping("/api/comments/users/{userId}")
    List<CommentDto> getComments(@PathVariable Long userId);

}