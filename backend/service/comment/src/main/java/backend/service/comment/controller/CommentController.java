package backend.service.comment.controller;

import backend.service.comment.dto.request.CreateRequestDto;
import backend.service.comment.dto.response.CreateResponse;
import backend.service.comment.dto.response.DeletedResponse;
import backend.service.comment.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Comment", description = "댓글 관리 API (JWT 인증 필요)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Operation(
            summary = "댓글 작성",
            description = """
                    게시글에 새로운 댓글 또는 대댓글을 작성합니다.
                    
                    - 최상위 댓글: parentPath를 null로 설정
                    - 대댓글: parentPath에 부모 댓글의 commentPath 값을 설정
                    
                    [최상위 댓글 예시]
                    {
                        "boardId": 295926545373777920,
                        "userId": 295921111410794496,
                        "nickName": "홍길동",
                        "content": "댓글 내용",
                        "parentPath": null
                    }
                    
                    [대댓글 예시] (parentPath에 부모 댓글의 commentPath 입력)
                    {
                        "boardId": 295926545373777920,
                        "userId": 295921111410794496,
                        "nickName": "홍길동",
                        "content": "대댓글 내용",
                        "parentPath": "00000"
                    }
                    
                    댓글 계층은 최대 5depth까지 가능합니다.
                    응답의 commentPath 값을 parentPath로 사용하면 대댓글 작성이 가능합니다.
                    """
    )
    @PostMapping("/create")
    public CreateResponse create(@RequestBody CreateRequestDto createRequestDto, HttpServletRequest request) {
        return commentService.create(createRequestDto, request);
    }

    @Operation(
            summary = "댓글 무한 스크롤 조회",
            description = """
                    무한 스크롤 방식으로 댓글 목록을 조회합니다.
                    
                    - 첫 조회: lastPath 없이 요청
                    - 이후 조회: 마지막으로 받은 댓글의 commentPath를 lastPath로 설정
                    
                    댓글은 commentPath 기준 오름차순 정렬로 반환됩니다.
                    (최상위 댓글 → 해당 댓글의 대댓글 순서로 반환)
                    """
    )
    @GetMapping("/infinite-scroll")
    public List<CreateResponse> readAllInfiniteScroll(
            @Parameter(description = "게시글 ID", example = "295926545373777920") @RequestParam("boardId") Long boardId,
            @Parameter(description = "마지막으로 조회된 댓글의 commentPath (첫 조회 시 null)") @RequestParam(value = "lastPath", required = false) String lastPath,
            @Parameter(description = "가져올 댓글 개수", example = "10") @RequestParam("pageSize") Long pageSize) {
        return commentService.getAllInfiniteScroll(boardId, lastPath, pageSize);
    }

    @Operation(
            summary = "게시글별 댓글 목록 조회",
            description = """
                    특정 게시글에 달린 모든 댓글을 조회합니다.
                    
                    댓글은 commentPath 기준 오름차순 정렬로 반환됩니다.
                    (최상위 댓글 → 해당 댓글의 대댓글 순서로 반환)
                    """
    )
    @GetMapping("/getCommentWithBoardId/{boardId}")
    public List<CreateResponse> getBoardWhoCreateWithBoardId(
            @Parameter(description = "게시글 ID", example = "295926545373777920") @PathVariable("boardId") Long boardId) {
        return commentService.getBoardWhoCreateWithBoardId(boardId);
    }

    @Operation(
            summary = "사용자별 댓글 목록 조회",
            description = "특정 사용자가 작성한 모든 댓글을 조회합니다."
    )
    @GetMapping("/users/{userId}")
    public List<CreateResponse> getBoardWhoCreateWithUserId(
            @Parameter(description = "사용자 ID", example = "279296958190669820") @PathVariable("userId") Long userId) {
        return commentService.getBoardWhoCreateWithUserId(userId);
    }

    @Operation(
            summary = "댓글 삭제",
            description = """
                    댓글을 삭제합니다.
                    
                    - 대댓글이 없는 경우: DB에서 완전 삭제
                    - 대댓글이 있는 경우: 내용만 삭제 처리 (isDelete: true)
                    """
    )
    @DeleteMapping("/delete/{commentId}")
    public DeletedResponse delete(
            @Parameter(description = "삭제할 댓글 ID", example = "279305241031393280") @PathVariable("commentId") Long commentId) {
        return commentService.delete(commentId);
    }

    @Operation(
            summary = "댓글 좋아요",
            description = """
                    댓글에 좋아요를 추가합니다.
                    
                    - 같은 댓글에 중복 좋아요 불가
                    - 응답: 현재 좋아요 수 반환
                    """
    )
    @PostMapping("/like/{commentId}")
    public Long like(
            @Parameter(description = "좋아요할 댓글 ID", example = "279305241031393280") @PathVariable Long commentId,
            HttpServletRequest request) {
        return commentService.like(commentId, request);
    }

    @Operation(
            summary = "댓글 좋아요 취소",
            description = """
                    댓글 좋아요를 취소합니다.
                    
                    - 좋아요를 누르지 않은 댓글은 취소 불가
                    - 응답: 현재 좋아요 수 반환
                    """
    )
    @DeleteMapping("/like/{commentId}")
    public Long unlike(
            @Parameter(description = "좋아요 취소할 댓글 ID", example = "279305241031393280") @PathVariable Long commentId,
            HttpServletRequest request) {
        return commentService.unlike(commentId, request);
    }
}