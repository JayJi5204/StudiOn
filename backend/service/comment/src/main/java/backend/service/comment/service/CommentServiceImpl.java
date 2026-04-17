package backend.service.comment.service;

import backend.common.kafkaDto.comment.CommentCreatedEvent;
import backend.common.kafkaDto.comment.CommentDeletedEvent;
import backend.service.comment.dto.request.CreateRequest;
import backend.service.comment.dto.request.UpdateRequest;
import backend.service.comment.dto.response.*;
import backend.service.comment.entity.CommentEntity;
import backend.service.comment.entity.CommentPath;
import backend.service.comment.kafka.KafkaProducer;
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
    private final KafkaProducer kafkaProducer;

    @Transactional
    public CreateResponse create(CreateRequest dto, HttpServletRequest request) {
        CommentEntity parent = findParent(dto);
        CommentPath parentCommentPath = parent == null ? CommentPath.create("") : parent.getCommentPath();

        Long userId=SecurityUtil.getCurrentUserId(request);
        String nickName=SecurityUtil.getNickname(request);

        CommentEntity comment = commentRepository.save(
                CommentEntity.create(
                        snowflake.nextId(),
                        dto.getContent(),
                        parentCommentPath.createChildCommentPath(
                                commentRepository.findDescendantsTopPath(
                                        Long.parseLong(dto.getBoardId()), parentCommentPath.getPath()).orElse(null)),
                        Long.parseLong(dto.getBoardId()), userId,nickName));

        kafkaProducer.send("comment.created", new CommentCreatedEvent(Long.parseLong(dto.getBoardId())));


        return CreateResponse.from(comment, 0L);
    }

    private CommentEntity findParent(CreateRequest requestDto) {
        String parentPath = requestDto.getParentPath();
        if (parentPath == null) {
            return null;
        }
        return commentRepository.findByPath(parentPath)
                .filter(not(CommentEntity::getIsDeleted))
                .orElseThrow();
    }

    public CreateResponse get(Long commentId) {
        return commentRepository.findById(commentId)
                .map(entity -> CreateResponse.from(entity, commentCountService.getLikeCount(commentId)))
                .orElse(null);
    }

    @Transactional
    public DeletedResponse delete(Long commentId) {
        commentRepository.findById(commentId).filter(not(CommentEntity::getIsDeleted)).ifPresent(commentEntity -> {
            if (hasChildren(commentEntity)) {
                commentEntity.delete();
            } else {
                delete(commentEntity);
            }

            kafkaProducer.send("comment.deleted", new CommentDeletedEvent(commentEntity.getBoardId()));
        });
        return DeletedResponse.from();
    }

    @Transactional
    public UpdateResponse update(Long commentId, UpdateRequest dto, HttpServletRequest request) {
        CommentEntity entity = commentRepository.findById(commentId).orElseThrow();

        Long userId = SecurityUtil.getCurrentUserId(request);
        if (!entity.getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한 없음");
        }

        entity.update(dto.getContent());

        return UpdateResponse.from(entity);
    }

    private boolean hasChildren(CommentEntity commentEntity) {
        return commentRepository.findDescendantsTopPath(commentEntity.getBoardId(), commentEntity.getCommentPath().getPath()).isPresent();
    }

    private void delete(CommentEntity commentEntity) {
        commentRepository.delete(commentEntity);
        if (!commentEntity.isRoot()) {
            commentRepository.findByPath(commentEntity.getCommentPath().getParentPath())
                    .filter(CommentEntity::getIsDeleted)
                    .filter(not(this::hasChildren))
                    .ifPresent(this::delete);
        }
    }

    public List<GetResponse> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        Pageable pageable = PageRequest.of(0, pageSize.intValue());

        List<CommentEntity> comments = lastPath == null ?
                commentRepository.findByBoardIdOrderByCommentPathPathAsc(boardId, pageable) :
                commentRepository.findByBoardIdAndCommentPathPathGreaterThanOrderByCommentPathPathAsc(boardId, lastPath, pageable);

        return comments.stream()
                .map(entity -> GetResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId()), commentCountService.isLiked(entity.getCommentId(), userId)))
                .toList();
    }

    @Override
    public List<GetResponse> getCommentWithBoardId(Long boardId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return commentRepository.findAllByBoardId(boardId).stream()
                .map(entity -> GetResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId()), commentCountService.isLiked(entity.getCommentId(), userId)))
                .toList();
    }

    @Override
    public List<GetResponse> getCommentWithUserId(Long userId, HttpServletRequest request) {
        Long currentUserId = SecurityUtil.getCurrentUserId(request);
        return commentRepository.findAllByUserId(userId).stream()
                .map(entity -> GetResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId()), commentCountService.isLiked(entity.getCommentId(), currentUserId)))
                .toList();
    }

    @Override
    public LikeResponse like(Long commentId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return commentCountService.like(commentId, userId);
    }

    @Override
    public LikeResponse unlike(Long commentId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return commentCountService.unlike(commentId, userId);
    }
}