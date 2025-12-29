package backend.service.board.controller;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;
import backend.service.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/{boardId}")
    public BoardResponseDto get(@PathVariable Long boardId) {
        return boardService.getBoards(boardId);
    }

    @GetMapping("/get/{userId}")
    public List<BoardResponseDto> getBoardWhoCreate(@PathVariable("userId") Long userId) { // List로 변경
        return boardService.getBoardWhoCreate(userId);
    }

    @GetMapping("/getAll")
    public PageResponseDto getAllBoards(@RequestParam("boardKey") Long boardKey, @RequestParam("page") Long page, @RequestParam("pageSize") Long pageSize) {
        return boardService.getAllBoards(boardKey, page, pageSize);
    }

    @PostMapping("/create")
    public BoardResponseDto create(@RequestBody BoardCreateRequestDto boardCreateRequestDto) {
        return boardService.create(boardCreateRequestDto);
    }

    @PutMapping("/update/{boardId}")
    public BoardResponseDto update(@PathVariable Long boardId, @RequestBody BoardUpdateRequestDto boardUpdateRequestDto) {
        return boardService.update(boardId, boardUpdateRequestDto);
    }

    @DeleteMapping("/delete/{boardId}")
    public void delete(@PathVariable Long boardId) {
        boardService.delete(boardId);
    }

}
