package backend.service.board.controller;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponse;
import backend.service.board.dto.response.DeletedResponse;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
    public BoardResponse create(@RequestBody BoardCreateRequestDto boardCreateRequestDto) {
        return boardService.create(boardCreateRequestDto);
    }

    @Operation(summary = "게시글 상세 조회", description = "게시글 ID를 통해 상세 내용을 조회합니다.")
    @GetMapping("/get/{boardId}")
    public GetBoardResponse getBoard(
            @Parameter(description = "조회할 게시글 ID", example = "1")
            @PathVariable Long boardId) {
        return boardService.getBoard(boardId);
    }

    @Operation(summary = "게시글 전체 페이징 조회", description = "페이징 처리가 된 게시글 목록을 가져옵니다.")
    @GetMapping("/getAll")
    public PageResponseDto getAllBoards(
            @Parameter(description = "마지막으로 조회된 게시글 ID (커서)", example = "100") @RequestParam("boardKey") Long boardKey,
            @Parameter(description = "현재 페이지 번호", example = "1") @RequestParam("page") Long page,
            @Parameter(description = "한 페이지당 보여줄 개수", example = "10") @RequestParam("pageSize") Long pageSize) {
        return boardService.getAllBoards(boardKey, page, pageSize);
    }

    @Operation(summary = "사용자별 작성 게시글 조회", description = "특정 사용자가 작성한 모든 게시글을 리스트로 반환합니다.")
    @GetMapping("/getBoard/{userId}")
    public List<BoardResponse> getBoardWhoCreate(
            @Parameter(description = "작성자 ID", example = "279296958190669824")
            @PathVariable("userId") Long userId) {
        return boardService.getBoardWhoCreate(userId);
    }

    @Operation(summary = "게시글 수정")
    @PutMapping("/update/{boardId}")
    public BoardResponse update(
            @Parameter(description = "수정할 게시글 ID", example = "279296958190669824") @PathVariable Long boardId,
            @RequestBody BoardUpdateRequestDto boardUpdateRequestDto) {
        return boardService.update(boardId, boardUpdateRequestDto);
    }

    @Operation(summary = "게시글 삭제")
    @DeleteMapping("/delete/{boardId}")
    public DeletedResponse delete(
            @Parameter(description = "삭제할 게시글 ID", example = "279296958190669824") @PathVariable Long boardId) {
        return boardService.delete(boardId);
    }
}