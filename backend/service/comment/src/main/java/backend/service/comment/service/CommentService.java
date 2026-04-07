package backend.service.comment.service;

import backend.service.comment.dto.request.CreateRequestDto;
import backend.service.comment.dto.response.CreateResponse;
import backend.service.comment.dto.response.DeletedResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface CommentService {

    CreateResponse create(CreateRequestDto createRequestDto);

    DeletedResponse delete(Long commentId);

    List<CreateResponse> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize);

    List<CreateResponse> getBoardWhoCreateWithBoardId(Long boardId);

    List<CreateResponse> getBoardWhoCreateWithUserId(Long userId);

    Long like(Long commentId, HttpServletRequest request);

    Long unlike(Long commentId, HttpServletRequest request);

    }
