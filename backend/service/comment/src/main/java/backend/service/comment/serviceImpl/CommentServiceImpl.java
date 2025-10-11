package backend.service.comment.serviceImpl;

import backend.service.comment.dto.request.CommentCreateRequestDto;
import backend.service.comment.dto.response.CommentResponseDto;
import backend.service.comment.entity.CommentEntity;
import backend.service.comment.repository.CommentRepository;
import backend.service.comment.service.CommentService;
import jakarta.transaction.Transactional;
import kuke.board.common.snowflake.Snowflake;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static java.util.function.Predicate.not;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final Snowflake snowflake = new Snowflake();

    @Transactional
    public CommentResponseDto create(CommentCreateRequestDto commentCreateRequestDto) {
        CommentEntity commentEntity = findParent(commentCreateRequestDto);
        CommentEntity comment = commentRepository.save(CommentEntity.create(snowflake.nextId(), commentCreateRequestDto.getContent(), commentEntity == null ? null : commentEntity.getParentCommentId(), commentCreateRequestDto.getUserId(), commentCreateRequestDto.getBoardId()));
        return CommentResponseDto.from(comment);
    }

    private CommentEntity findParent(CommentCreateRequestDto commentCreateRequestDto) {
        Long parentCommentId = commentCreateRequestDto.getParentCommentId();
        if (parentCommentId == null) {
            return null;
        }
        return commentRepository.findById(parentCommentId).filter(not(CommentEntity::getIsDelete)).filter(CommentEntity::isRoot).orElseThrow();
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
        return commentRepository.countBy(commentEntity.getBoardId(), commentEntity.getParentCommentId(), 2L) == 2L;
    }

    private void delete(CommentEntity commentEntity) {
        commentRepository.delete(commentEntity);
        if (!commentEntity.isRoot()) {
            commentRepository.findById(commentEntity.getCommentId()).filter(CommentEntity::getIsDelete).filter(not(this::hasChildren)).ifPresent(this::delete);
        }
    }
}
