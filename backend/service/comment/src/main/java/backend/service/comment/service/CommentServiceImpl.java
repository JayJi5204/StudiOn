package backend.service.comment.service;

import backend.service.comment.dto.request.CreateRequest;
import backend.service.comment.dto.request.UpdateRequest;
import backend.service.comment.dto.response.CreateResponse;
import backend.service.comment.dto.response.DeletedResponse;
import backend.service.comment.dto.response.UpdateResponse;
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

        return CreateResponse.from(comment, 0L);
    }

    private CommentEntity findParent(CreateRequest requestDto) {
        String parentPath = requestDto.getParentPath();
        if (parentPath == null) {
            return null;
        }
        return commentRepository.findByPath(parentPath)
                .filter(not(CommentEntity::getIsDelete))
                .orElseThrow();
    }

    public CreateResponse get(Long commentId) {
        return commentRepository.findById(commentId)
                .map(entity -> CreateResponse.from(entity, commentCountService.getLikeCount(commentId)))
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
                    .filter(CommentEntity::getIsDelete)
                    .filter(not(this::hasChildren))
                    .ifPresent(this::delete);
        }
    }

    public List<CreateResponse> getAllInfiniteScroll(Long boardId, String lastPath, Long pageSize) {
        Pageable pageable = PageRequest.of(0, pageSize.intValue());

        List<CommentEntity> comments = lastPath == null ?
                commentRepository.findByBoardIdOrderByCommentPathPathAsc(boardId, pageable) :
                commentRepository.findByBoardIdAndCommentPathPathGreaterThanOrderByCommentPathPathAsc(boardId, lastPath, pageable);

        return comments.stream()
                .map(entity -> CreateResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
                .toList();
    }

    @Override
    public List<CreateResponse> getBoardWhoCreateWithBoardId(Long boardId) {
        return commentRepository.findAllByBoardId(boardId).stream()
                .map(entity -> CreateResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
                .toList();
    }

    @Override
    public List<CreateResponse> getBoardWhoCreateWithUserId(Long userId) {
        return commentRepository.findAllByUserId(userId).stream()
                .map(entity -> CreateResponse.from(entity, commentCountService.getLikeCount(entity.getCommentId())))
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