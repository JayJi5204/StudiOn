package backend.service.comment.service;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.util.SecurityUtil;
import backend.service.comment.dto.other.GetBoardResponse;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.common.kafkaEvent.comment.CommentDeletedEvent;
import backend.service.comment.dto.request.CreateRequest;
import backend.service.comment.dto.request.UpdateRequest;
import backend.service.comment.dto.response.*;
import backend.service.comment.entity.CommentEntity;
import backend.service.comment.entity.CommentPath;
import backend.service.comment.feign.BoardClient;
import backend.service.comment.repository.CommentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import backend.common.id.Snowflake;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

import static java.util.function.Predicate.not;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final Snowflake snowflake = new Snowflake();
    private final CommentCountService commentCountService;
    private final KafkaProducer kafkaProducer;
    private final BoardClient boardClient;

    @Transactional
    public CreateResponse create(CreateRequest dto, HttpServletRequest request) {
        CommentEntity parent = findParent(dto);
        CommentPath parentCommentPath = parent == null ? CommentPath.create("") : parent.getCommentPath();

        Long userId = SecurityUtil.getCurrentUserId(request);
        String nickName = SecurityUtil.getNickname(request);

        CommentEntity comment = commentRepository.save(
                CommentEntity.create(
                        snowflake.nextId(),
                        dto.getContent(),
                        parentCommentPath.createChildCommentPath(
                                commentRepository.findDescendantsTopPath(
                                        Long.parseLong(dto.getBoardId()), parentCommentPath.getPath()).orElse(null)),
                        Long.parseLong(dto.getBoardId()), userId, nickName));

        // 게시글 작성자에게 댓글 알림
        try {
            GetBoardResponse board = boardClient.getBoard(Long.parseLong(dto.getBoardId()));
            Long boardOwnerId = Long.parseLong(board.getUserId());

            // 본인 댓글이면 알림 안 보냄
            if (!boardOwnerId.equals(userId)) {
                kafkaProducer.send("alarm", new AlarmEvent(
                        boardOwnerId,
                        "COMMENT",
                        nickName + "님이 댓글을 달았습니다",
                        Long.parseLong(dto.getBoardId())
                ));
            }
        } catch (Exception e) {
            log.error("댓글 알림 발행 실패", e);
        }

        return CreateResponse.from(comment, 0L);
    }

    private CommentEntity findParent(CreateRequest requestDto) {
        String parentPath = requestDto.getParentPath();
        if (parentPath == null) {
            return null;
        }
        return commentRepository.findByPath(parentPath)
                .filter(not(CommentEntity::getIsDeleted))
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
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
        Long userId = SecurityUtil.getCurrentUserId(request);
        CommentEntity entity = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        if (!entity.getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.COMMENT_UNAUTHORIZED);
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

    @Override
    @Transactional
    public DeletedResponse forceDelete(Long commentId, HttpServletRequest request) {
        String role = SecurityUtil.getCurrentUserRole(request);
        if (!role.equals("ADMIN")) {
            throw new CustomException(ErrorCode.ADMIN_UNAUTHORIZED);
        }

        CommentEntity entity = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        if (hasChildren(entity)) {
            entity.delete();
        } else {
            delete(entity);
        }

        kafkaProducer.send("comment.deleted", new CommentDeletedEvent(entity.getBoardId()));

        return DeletedResponse.from();
    }
}