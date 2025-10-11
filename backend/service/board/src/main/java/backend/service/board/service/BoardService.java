package backend.service.board.service;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;


public interface BoardService {

    BoardResponseDto create(BoardCreateRequestDto boardCreateRequestDto);

    BoardResponseDto update(Long boardId, BoardUpdateRequestDto boardUpdateRequestDto);

    BoardResponseDto read(Long boardId);

    void delete(Long boardId);

    PageResponseDto readAll(Long boardKey, Long page, Long pageSize);

}
