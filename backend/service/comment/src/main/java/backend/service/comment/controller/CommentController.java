package backend.service.comment.controller;


import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentPageResponse;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/comments/{commentId}")
    public CommentResponseDto read(@PathVariable("commentId") Long commentId) {
        return commentService.read(commentId);
    }

    @PostMapping("/comments")
    public CommentResponseDto create(@RequestBody CommentCreateRequestDto commentCreateRequestDto) {
        return commentService.create(commentCreateRequestDto);
    }

    @DeleteMapping("/comments/{commentId}")
    public void delete(@PathVariable("commentId") Long commentId) {
        commentService.delete(commentId);
    }

    @GetMapping("/comments")
    public CommentPageResponse readAll(@RequestParam("boardId") Long boardId, @RequestParam("page") Long page, @RequestParam("pageSize") Long pageSize) {
        return commentService.readAll(boardId, page, pageSize);
    }

    @GetMapping("/comments/infinite-scroll")
    public List<CommentResponseDto> readAllInfiniteScroll(@RequestParam("boardId") Long boardId, @RequestParam(value = "lastPath", required = false) String lastPath, @RequestParam("pageSize") Long pageSize) {
        return commentService.readAllInfiniteScroll(boardId, lastPath, pageSize);
    }


}
