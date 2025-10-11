package backend.service.board.controller;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;
import backend.service.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boards/{boardId}")
    public BoardResponseDto read(@PathVariable Long boardId) {
        return boardService.read(boardId);
    }

    @GetMapping("/boards")
    public PageResponseDto readAll(@RequestParam("boardKey") Long boardKey, @RequestParam("page") Long page, @RequestParam("pageSize") Long pageSize) {
        return boardService.readAll(boardKey, page, pageSize);
    }


    @PostMapping("/boards")
    public BoardResponseDto create(@RequestBody BoardCreateRequestDto boardCreateRequestDto) {
        return boardService.create(boardCreateRequestDto);
    }

    @PutMapping("/boards/{boardId}")
    public BoardResponseDto update(@PathVariable Long boardId, @RequestBody BoardUpdateRequestDto boardUpdateRequestDto) {
        return boardService.update(boardId, boardUpdateRequestDto);
    }

    @DeleteMapping("/boards/{boardId}")
    public void delete(@PathVariable Long boardId) {
        boardService.delete(boardId);
    }
}
