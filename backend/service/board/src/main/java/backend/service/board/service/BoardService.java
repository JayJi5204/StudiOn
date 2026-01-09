package backend.service.board.service;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;

import java.util.List;


public interface BoardService {

    BoardResponseDto create(BoardCreateRequestDto boardCreateRequestDto);

    BoardResponseDto update(Long boardId, BoardUpdateRequestDto boardUpdateRequestDto);

    BoardResponseDto getBoards(Long boardId);

    void delete(Long boardId);

    PageResponseDto getAllBoards(Long boardKey, Long page, Long pageSize);

    List<BoardResponseDto> getBoardWhoCreate(Long userId);

    GetBoardResponse getBoard(Long userId);

}
