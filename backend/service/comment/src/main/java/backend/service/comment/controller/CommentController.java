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
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/get/{commentId}")
    public CommentResponseDto get(@PathVariable("commentId") Long commentId) {
        return commentService.get(commentId);
    }

    @PostMapping("/create")
    public CommentResponseDto create(@RequestBody CommentCreateRequestDto commentCreateRequestDto) {
        return commentService.create(commentCreateRequestDto);
    }

    @DeleteMapping("/delete/{commentId}")
    public void delete(@PathVariable("commentId") Long commentId) {
        commentService.delete(commentId);
    }

    @GetMapping("/getAll")
    public CommentPageResponse getAllComment(@RequestParam("boardId") Long boardId, @RequestParam("page") Long page, @RequestParam("pageSize") Long pageSize) {
        return commentService.getAll(boardId, page, pageSize);
    }

    @GetMapping("/infinite-scroll")
    public List<CommentResponseDto> readAllInfiniteScroll(@RequestParam("boardId") Long boardId, @RequestParam(value = "lastPath", required = false) String lastPath, @RequestParam("pageSize") Long pageSize) {
        return commentService.getAllInfiniteScroll(boardId, lastPath, pageSize);
    }

    @GetMapping("/getCommentWithBoardId/{boardId}")
    public List<CommentResponseDto> getBoardWhoCreateWithBoardId(@PathVariable("boardId") Long boardId) { // List로 변경
        return commentService.getBoardWhoCreateWithBoardId(boardId);
    }

    @GetMapping("/getCommentWithUserId/{userId}")
    public List<CommentResponseDto> getBoardWhoCreateWithUserId(@PathVariable("userId") Long userId) { // List로 변경
        return commentService.getBoardWhoCreateWithUserId(userId);
    }

}
