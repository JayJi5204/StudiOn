package backend.service.board.service;

import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.GetResponseWithComment;
import backend.service.board.dto.response.PageResponse;
import backend.service.board.dto.response.DeletedResponse;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.enumType.Category;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BoardService {

    GetBoardResponse create(CreateRequest createRequest);

    Page<PageResponse> getPage(Category category, int page, int size);

    GetResponseWithComment getBoard(Long userId);

    GetBoardResponse update(Long boardId, UpdateRequest updateRequest);

    DeletedResponse delete(Long boardId);

    List<GetBoardResponse> getBoardWhoCreate(Long userId);

}
