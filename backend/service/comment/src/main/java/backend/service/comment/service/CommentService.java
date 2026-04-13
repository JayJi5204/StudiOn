package backend.service.comment.service;

import backend.service.comment.dto.request.CreateRequest;
import backend.service.comment.dto.request.UpdateRequest;
import backend.service.comment.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface CommentService {

    CreateResponse create(CreateRequest createRequest, HttpServletRequest request);

    DeletedResponse delete(Long commentId);

    UpdateResponse update(Long commentId, UpdateRequest dto, HttpServletRequest request);

    List<GetResponse> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize, HttpServletRequest request);

    List<GetResponse> getCommentWithBoardId(Long boardId, HttpServletRequest request);

    List<GetResponse> getCommentWithUserId(Long userId,HttpServletRequest request);

    LikeResponse like(Long commentId, HttpServletRequest request);

    LikeResponse unlike(Long commentId, HttpServletRequest request);
}