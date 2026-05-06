package backend.service.board.service;

import backend.common.enumType.BoardCategory;
import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.common.kafkaEvent.board.BoardDeleteEvent;
import backend.common.util.SecurityUtil;
import backend.service.board.dto.other.CommentDto;
import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.*;
import backend.service.board.entity.BoardEntity;
import backend.service.board.feign.CommentClient;
import backend.service.board.repository.BoardRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;
    private final KafkaProducer kafkaProducer;
    private final CommentClient commentClient;
    private final BoardCountService boardCountService;

    @Transactional
    public CreateResponse create(CreateRequest dto, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        String nickName = SecurityUtil.getNickname(request);
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), userId, nickName, dto.getTitle(), dto.getContent(), dto.getBoardCategory(), dto.getTags())
        );
        return CreateResponse.from(boardEntity);
    }

    @Override
    public GetWithCommentResponse getBoard(Long boardId, HttpServletRequest request) {
        BoardEntity entity = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        Long userId = SecurityUtil.getCurrentUserId(request);

        List<CommentDto> responseComments = commentClient.getComments(boardId);

        Long viewCount = boardCountService.incrementViewCount(boardId);
        Long likeCount = boardCountService.getLikeCount(boardId);
        boolean isLiked = boardCountService.isLiked(boardId, userId);

        return GetWithCommentResponse.from(entity, responseComments, viewCount, likeCount, isLiked);
    }

    @Override
    public Page<PageResponse> getPage(BoardCategory boardCategory, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("boardId").descending());

        Page<BoardEntity> boards;
        if (keyword != null && !keyword.isBlank()) {
            if (boardCategory == null) {
                boards = boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
            } else {
                boards = boardRepository.findByBoardCategoryAndTitleContainingOrBoardCategoryAndContentContaining(
                        boardCategory, keyword, boardCategory, keyword, pageable);
            }
        } else {
            if (boardCategory == null) {
                boards = boardRepository.findAll(pageable);
            } else {
                boards = boardRepository.findByBoardCategory(boardCategory, pageable);
            }
        }

        return boards.map(board -> {
            Long viewCount = boardCountService.getViewCount(board.getBoardId());
            Long likeCount = boardCountService.getLikeCount(board.getBoardId());
            Long commentCount = boardCountService.getCommentCount(board.getBoardId());
            return PageResponse.from(board, viewCount, likeCount, commentCount);
        });
    }

    @Override
    public List<GetBoardResponse> getBoardWhoCreate(Long userId) {
        List<BoardEntity> entity = boardRepository.findAllByUserId(userId);
        return entity.stream()
                .map(board -> {
                    Long viewCount = boardCountService.getViewCount(board.getBoardId());
                    Long likeCount = boardCountService.getLikeCount(board.getBoardId());
                    return GetBoardResponse.from(board, viewCount, likeCount);
                })
                .toList();
    }

    @Transactional
    public UpdateResponse update(Long boardId, UpdateRequest dto, HttpServletRequest request) {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        Long userId = SecurityUtil.getCurrentUserId(request);
        if (!boardEntity.getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.BOARD_UNAUTHORIZED);
        }

        boardEntity.update(dto.getTitle(), dto.getContent(), dto.getBoardCategory(), dto.getTags());

        Long viewCount = boardCountService.getViewCount(boardId);
        Long likeCount = boardCountService.getLikeCount(boardId);

        return UpdateResponse.from(boardEntity, viewCount, likeCount);
    }

    @Transactional
    public DeletedResponse delete(Long boardId, HttpServletRequest request) {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        Long userId = SecurityUtil.getCurrentUserId(request);
        if (!boardEntity.getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.BOARD_UNAUTHORIZED);
        }

        boardRepository.deleteById(boardId);

        BoardDeleteEvent event = new BoardDeleteEvent(boardId, LocalDateTime.now());
        kafkaProducer.send("board.deleted", event);

        return DeletedResponse.from();
    }

    @Override
    public LikeResponse like(Long boardId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return boardCountService.like(boardId, userId);
    }

    @Override
    public LikeResponse unlike(Long boardId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return boardCountService.unlike(boardId, userId);
    }

    @Override
    public List<RankingResponse> getViewRanking(int top) {
        List<String> boardIds = boardCountService.getViewRanking(top);
        long rank = 1;
        List<RankingResponse> result = new ArrayList<>();
        for (String boardId : boardIds) {
            BoardEntity entity = boardRepository.findById(Long.parseLong(boardId)).orElse(null);
            if (entity != null && entity.getBoardCategory() != BoardCategory.NOTICE) {  // NOTICE 제외
                Long viewCount = boardCountService.getViewCount(Long.parseLong(boardId));
                result.add(RankingResponse.from(entity, viewCount, rank++));
            }
        }
        return result;
    }

    @Override
    public List<RankingResponse> getLikeRanking(int top) {
        List<String> boardIds = boardCountService.getLikeRanking(top);
        long rank = 1;
        List<RankingResponse> result = new ArrayList<>();
        for (String boardId : boardIds) {
            BoardEntity entity = boardRepository.findById(Long.parseLong(boardId)).orElse(null);
            if (entity != null && entity.getBoardCategory() != BoardCategory.NOTICE) {  // NOTICE 제외
                Long likeCount = boardCountService.getLikeCount(Long.parseLong(boardId));
                result.add(RankingResponse.from(entity, likeCount, rank++));
            }
        }
        return result;
    }

    @Override
    @Transactional
    public DeletedResponse forceDelete(Long boardId, HttpServletRequest request) {
        String role = SecurityUtil.getCurrentUserRole(request);
        if (!role.equals("ADMIN")) {
            throw new CustomException(ErrorCode.ADMIN_UNAUTHORIZED);
        }

        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        boardRepository.delete(board);

        kafkaProducer.send("board.deleted", new BoardDeleteEvent(boardId, LocalDateTime.now()));

        kafkaProducer.send("alarm", new AlarmEvent(
                board.getUserId(),
                "BOARD_FORCE_DELETED",
                "회원님의 게시글 [" + board.getTitle() + "]이 관리자에 의해 삭제되었습니다.",
                boardId
        ));

        return DeletedResponse.from();
    }
}