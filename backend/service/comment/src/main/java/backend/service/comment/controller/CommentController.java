package backend.service.comment.controller;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentPageResponse;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.dto.response.DeletedResponse;
import backend.service.comment.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Comment", description = "댓글 관리 API (JWT 인증 필요)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "댓글 작성", description = "게시글에 새로운 댓글을 작성합니다.")
    @PostMapping("/create")
    public CommentResponseDto create(@RequestBody CommentCreateRequestDto commentCreateRequestDto) {
        return commentService.create(commentCreateRequestDto);
    }

    @Operation(summary = "댓글 단건 조회", description = "댓글 ID로 특정 댓글을 조회합니다.")
    @GetMapping("/get/{commentId}")
    public CommentResponseDto get(
            @Parameter(description = "댓글 ID", example = "279305241031393280")
            @PathVariable("commentId") Long commentId) {
        return commentService.get(commentId);
    }

    @Operation(summary = "댓글 전체 조회 (일반 페이징)", description = "특정 게시글의 댓글을 페이지 번호 기반으로 조회합니다.")
    @GetMapping("/getAll")
    public CommentPageResponse getAllComment(
            @Parameter(description = "게시글 ID", example = "10") @RequestParam("boardId") Long boardId,
            @Parameter(description = "페이지 번호", example = "1") @RequestParam("page") Long page,
            @Parameter(description = "페이지당 개수", example = "10") @RequestParam("pageSize") Long pageSize) {
        return commentService.getAll(boardId, page, pageSize);
    }

    @Operation(summary = "댓글 무한 스크롤 조회", description = "마지막 댓글의 정보를 기준으로 다음 댓글 목록을 가져옵니다.")
    @GetMapping("/infinite-scroll")
    public List<CommentResponseDto> readAllInfiniteScroll(
            @Parameter(description = "게시글 ID") @RequestParam("boardId") Long boardId,
            @Parameter(description = "마지막으로 조회된 댓글의 커서 값 (첫 조회 시 null)") @RequestParam(value = "lastPath", required = false) String lastPath,
            @Parameter(description = "가져올 개수") @RequestParam("pageSize") Long pageSize) {
        return commentService.getAllInfiniteScroll(boardId, lastPath, pageSize);
    }

    @Operation(summary = "게시글별 댓글 목록 조회", description = "특정 게시글에 달린 모든 댓글을 조회합니다.")
    @GetMapping("/getCommentWithBoardId/{boardId}")
    public List<CommentResponseDto> getBoardWhoCreateWithBoardId(
            @Parameter(description = "게시글 ID", example = "279305142229913600") @PathVariable("boardId") Long boardId) {
        return commentService.getBoardWhoCreateWithBoardId(boardId);
    }

    @Operation(summary = "사용자별 댓글 목록 조회", description = "특정 사용자가 작성한 모든 댓글을 조회합니다.")
    @GetMapping("/users/{userId}")
    public List<CommentResponseDto> getBoardWhoCreateWithUserId(
            @Parameter(description = "사용자 ID", example = "279296958190669820") @PathVariable("userId") Long userId) {
        return commentService.getBoardWhoCreateWithUserId(userId);
    }

    @Operation(summary = "댓글 삭제")
    @DeleteMapping("/delete/{commentId}")
    public DeletedResponse delete(
            @Parameter(description = "삭제할 댓글 ID", example = "279305241031393280") @PathVariable("commentId") Long commentId) {
        return commentService.delete(commentId);
    }
}