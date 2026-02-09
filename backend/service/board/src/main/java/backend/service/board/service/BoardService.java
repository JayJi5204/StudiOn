package backend.service.board.service;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponse;
import backend.service.board.dto.response.DeletedResponse;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.dto.response.PageResponseDto;

import java.util.List;


public interface BoardService {

    BoardResponse create(BoardCreateRequestDto boardCreateRequestDto);

    BoardResponse update(Long boardId, BoardUpdateRequestDto boardUpdateRequestDto);

    BoardResponse getBoards(Long boardId);

    DeletedResponse delete(Long boardId);

    PageResponseDto getAllBoards(Long boardKey, Long page, Long pageSize);

    List<BoardResponse> getBoardWhoCreate(Long userId);

    GetBoardResponse getBoard(Long userId);

}
