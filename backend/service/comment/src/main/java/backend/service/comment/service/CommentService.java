package backend.service.comment.service;

import backend.service.comment.dto.request.CreateRequest;
import backend.service.comment.dto.request.UpdateRequest;
import backend.service.comment.dto.response.CreateResponse;
import backend.service.comment.dto.response.DeletedResponse;
import backend.service.comment.dto.response.UpdateResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface CommentService {

    CreateResponse create(CreateRequest createRequest, HttpServletRequest request);

    DeletedResponse delete(Long commentId);

    UpdateResponse update(Long commentId, UpdateRequest dto, HttpServletRequest request);

    List<CreateResponse> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize);

    List<CreateResponse> getBoardWhoCreateWithBoardId(Long boardId);

    List<CreateResponse> getBoardWhoCreateWithUserId(Long userId);

    Long like(Long commentId, HttpServletRequest request);

    Long unlike(Long commentId, HttpServletRequest request);

    }
