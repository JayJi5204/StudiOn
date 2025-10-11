package backend.service.comment.controller;


import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/comment/{commnetId}")
    public CommentResponseDto read(@PathVariable("commentId") Long commentId) {
        return commentService.read(commentId);
    }

    @PostMapping("/comment")
    public CommentResponseDto create(@RequestParam CommentCreateRequestDto commentCreateRequestDto) {
        return commentService.create(commentCreateRequestDto);
    }

    @DeleteMapping("/comment/{CommentId}")
    public void delete(@PathVariable("commentId") Long commentId) {
        commentService.delete(commentId);
    }

}
