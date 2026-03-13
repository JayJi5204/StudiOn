package backend.service.comment.service;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentPageResponse;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.dto.response.DeletedResponse;

import java.util.List;

public interface CommentService {

    CommentResponseDto create(CommentCreateRequestDto commentCreateRequestDto);

    DeletedResponse delete(Long commentId);

    List<CommentResponseDto> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize);

    List<CommentResponseDto> getBoardWhoCreateWithBoardId(Long boardId);

    List<CommentResponseDto> getBoardWhoCreateWithUserId(Long userId);

    }
