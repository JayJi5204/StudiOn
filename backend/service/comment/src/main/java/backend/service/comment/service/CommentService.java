package backend.service.comment.service;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentResponseDto;

public interface CommentService {

    CommentResponseDto create(CommentCreateRequestDto commentCreateRequestDto);

    CommentResponseDto read(Long commentId);

    void delete(Long commentId);

}
