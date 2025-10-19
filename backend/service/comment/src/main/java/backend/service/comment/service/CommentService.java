package backend.service.comment.service;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentPageResponse;
import backend.service.comment.dto.response.CommentResponseDto;

import java.util.List;

public interface CommentService {

    CommentResponseDto create(CommentCreateRequestDto commentCreateRequestDto);

    CommentResponseDto read(Long commentId);

    void delete(Long commentId);

    CommentPageResponse readAll(Long boardId, Long page, Long pageSize);

    List<CommentResponseDto> readAllInfiniteScroll(Long boardId, String lastPath, Long pageSize);
}
