package backend.service.board.controller;

import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.*;
import backend.service.board.enumType.Category;
import backend.service.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Board", description = "게시판 관리 API (JWT 인증 필요)")
@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "게시글 작성", description = "새로운 게시글을 등록합니다.")
    @PostMapping("/create")
    public CreateResponse create(@RequestBody CreateRequest createRequest, HttpServletRequest request) {
        return boardService.create(createRequest,request);
    }

    @Operation(summary = "게시글 상세 조회", description = "게시글 ID를 통해 상세 내용을 조회합니다.")
    @GetMapping("/get/{boardId}")
    public GetWithCommentResponse getBoard(
            @Parameter(description = "조회할 게시글 ID", example = "290374683355869184")
            @PathVariable Long boardId) {
        return boardService.getBoard(boardId);
    }

    @Operation(
            summary = "게시글 페이징 조회",
            description = "페이징 처리된 게시글 목록을 조회합니다. 카테고리를 지정하면 해당 카테고리 게시글만 조회됩니다."
    )
    @GetMapping
    public Page<PageResponse> getPage(
            @Parameter(description = "게시글 카테고리 (미입력 시 전체 조회)", example = "COMMUNITY")
            @RequestParam(required = false)
            Category category,
            @Parameter(description = "페이지 번호 (1부터 시작)", example = "1")
            @RequestParam(defaultValue = "0")
            int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10")
            int size
    ) {
        return boardService.getPage(category, page-1, size);
    }

    @Operation(summary = "사용자별 작성 게시글 조회", description = "특정 사용자가 작성한 모든 게시글을 리스트로 반환합니다.")
    @GetMapping("/users/{userId}")
    public List<GetBoardResponse> getBoardWhoCreate(
            @Parameter(description = "작성자 ID", example = "279296958190669824")
            @PathVariable("userId") Long userId) {
        return boardService.getBoardWhoCreate(userId);
    }

    @Operation(summary = "게시글 수정")
    @PutMapping("/update/{boardId}")
    public UpdateResponse update(
            @Parameter(description = "수정할 게시글 ID", example = "279296958190669824") @PathVariable Long boardId,
            @RequestBody UpdateRequest updateRequest,HttpServletRequest request) {
        return boardService.update(boardId, updateRequest,request);
    }

    @Operation(summary = "게시글 삭제")
    @DeleteMapping("/delete/{boardId}")
    public DeletedResponse delete(
            @Parameter(description = "삭제할 게시글 ID", example = "279296958190669824") @PathVariable Long boardId,    HttpServletRequest request) {
        return boardService.delete(boardId,request);
    }

    @Operation(summary = "좋아요", description = "게시글에 좋아요를 추가합니다.")
    @PostMapping("/like/{boardId}")
    public Long like(
            @Parameter(description = "좋아요할 게시글 ID", example = "279296958190669824")
            @PathVariable Long boardId, HttpServletRequest request) {
        return boardService.like(boardId,request);
    }

    @Operation(summary = "좋아요 취소", description = "게시글에 좋아요를 취소합니다.")
    @DeleteMapping("/like/{boardId}")
    public Long unlike(
            @Parameter(description = "좋아요 취소할 게시글 ID", example = "279296958190669824")
            @PathVariable Long boardId,HttpServletRequest request) {
        return boardService.unlike(boardId,request);
    }
}