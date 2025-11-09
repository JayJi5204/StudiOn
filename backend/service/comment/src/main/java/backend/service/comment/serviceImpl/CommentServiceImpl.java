package backend.service.comment.serviceImpl;

import backend.service.comment.common.PageLimitCalculator;
import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentPageResponse;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.entity.CommentEntity;
import backend.service.comment.entity.CommentPath;
import backend.service.comment.repository.CommentRepository;
import backend.service.comment.service.CommentService;
import jakarta.transaction.Transactional;
import backend.security.common.Snowflake;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.function.Predicate.not;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final Snowflake snowflake = new Snowflake();

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
                        requestDto.getBoardId()));
        return CommentResponseDto.from(comment);
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

    public CommentResponseDto read(Long commentId) {
        return CommentResponseDto.from(commentRepository.findById(commentId).orElseThrow());
    }

    @Transactional
    public void delete(Long commentId) {
        commentRepository.findById(commentId).filter(not(CommentEntity::getIsDelete)).ifPresent(commentEntity -> {
            if (hasChildren(commentEntity)) {
                commentEntity.delete();
            } else {
                delete(commentEntity);
            }

        });
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

    public CommentPageResponse readAll(Long boardId, Long page, Long pageSize) {
        return CommentPageResponse.of(
                commentRepository.findAll(boardId, (page - 1) * pageSize, pageSize).stream()
                        .map(CommentResponseDto::from)
                        .toList(),
                commentRepository.count(boardId, PageLimitCalculator.calculatePageLimit(page, pageSize, 10L))
        );
    }

    public List<CommentResponseDto> readAllInfiniteScroll(Long boardId, String lastPath, Long pageSize) {
        List<CommentEntity> comments = lastPath == null ?
                commentRepository.findAllInfiniteScroll(boardId, pageSize) :
                commentRepository.findAllInfiniteScroll(boardId, lastPath, pageSize);

        return comments.stream()
                .map(CommentResponseDto::from)
                .toList();
    }

}
