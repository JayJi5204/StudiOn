package backend.service.board.service;

import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.*;
import backend.service.board.enumType.Category;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BoardService {
    CreateResponse create(CreateRequest dto, HttpServletRequest request);
    GetWithCommentResponse getBoard(Long boardId,HttpServletRequest request);
    Page<PageResponse> getPage(Category category, int page, int size);
    List<GetBoardResponse> getBoardWhoCreate(Long userId);
    UpdateResponse update(Long boardId, UpdateRequest dto, HttpServletRequest request);
    DeletedResponse delete(Long boardId, HttpServletRequest request);
    LikeResponse like(Long boardId, HttpServletRequest request);
    LikeResponse unlike(Long boardId, HttpServletRequest request);
}