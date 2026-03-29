package backend.service.comment.service;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.dto.response.DeletedResponse;
import backend.service.comment.entity.CommentEntity;
import backend.service.comment.entity.CommentPath;
import backend.service.comment.repository.CommentRepository;
import backend.service.comment.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import backend.common.id.Snowflake;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

import static java.util.function.Predicate.not;
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final Snowflake snowflake = new Snowflake();
    private final CommentCountService commentCountService;

    @Transactional
    public CommentResponseDto create(CommentCreateRequestDto requestDto) {
        CommentEntity parent = findParent(requestDto);
        CommentPath parentCommentPath = parent == null ? CommentPath.create("") : parent.getCommentPath();

        CommentEntity comment = commentRepository.save(
                CommentEntity.create(
                        snowflake.nextId(),
                        requestDto.getContent(),
                        parentCommentPath.createChildCommentPath(
                                commentRepository.findDescendantsTopPath(
                                        requestDto.getBoardId(), parentCommentPath.getPath()).orElse(null)),
                        requestDto.getUserId(),
                        requestDto.getBoardId(), requestDto.getNickName()));

        return CommentResponseDto.from(comment, 0L);
    }

    private CommentEntity findParent(CommentCreateRequestDto requestDto) {
        String parentPath = requestDto.getParentPath();
        if (parentPath == null) {
            return null;
        }
        return commentRepository.findByPath(parentPath)
                .filter(not(CommentEntity::getIsDelete))
                .orElseThrow();
    }

    public CommentResponseDto get(Long commentId) {
        return commentRepository.findById(commentId)
                .map(entity -> CommentResponseDto.from(entity, commentCountService.getLikeCount(commentId)))
                .orElse(null);
    }

    @Transactional
    public DeletedResponse delete(Long commentId) {
        commentRepository.findById(commentId).filter(not(CommentEntity::getIsDelete)).ifPresent(commentEntity -> {
            if (hasChildren(commentEntity)) {
                commentEntity.delete();
            } else {
                delete(commentEntity);
            }
        });
        return DeletedResponse.from();
    }

    private boolean hasChildren(CommentEntity commentEntity) {
        return commentRepository.findDescendantsTopPath(commentEntity.getBoardId(), commentEntity.getCommentPath().getPath()).isPresent();
    }

    private void delete(CommentEntity commentEntity) {
        commentRepository.delete(commentEntity);
        if (!commentEntity.isRoot()) {
            commentRepository.findByPath(commentEntity.getCommentPath().getParentPath())
                    .filter(CommentEntity::getIsDelete)
                    .filter(not(this::hasChildren))
                    .ifPresent(this::delete);
        }
    }

    public List<CommentResponseDto> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize) {
        Pageable pageable = PageRequest.of(0, pageSize.intValue());

        List<CommentEntity> comments = lastPath == null ?
                commentRepository.findByBoardIdOrderByCommentPathPathAsc(boardId, pageable) :
                commentRepository.findByBoardIdAndCommentPathPathGreaterThanOrderByCommentPathPathAsc(boardId, lastPath, pageable);

        return comments.stream()
                .map(entity -> CommentResponseDto.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
                .toList();
    }

    @Override
    public List<CommentResponseDto> getBoardWhoCreateWithBoardId(Long boardId) {
        return commentRepository.findAllByBoardId(boardId).stream()
                .map(entity -> CommentResponseDto.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
                .toList();
    }

    @Override
    public List<CommentResponseDto> getBoardWhoCreateWithUserId(Long userId) {
        return commentRepository.findAllByUserId(userId).stream()
                .map(entity -> CommentResponseDto.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
                .toList();
    }

    @Override
    public Long like(Long commentId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return commentCountService.like(commentId, userId);
    }

    @Override
    public Long unlike(Long commentId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return commentCountService.unlike(commentId, userId);
    }
}