package backend.service.board.service;

import backend.common.id.Snowflake;
import backend.common.event.board.BoardDeleteEvent;
import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.*;
import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import backend.service.board.feignClient.CommentClient;
import backend.service.board.kafka.KafkaProducer;
import backend.service.board.repository.BoardRepository;
import backend.service.board.util.SecurityUtil;
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
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), userId, dto.getNickName(), dto.getTitle(), dto.getContent(), dto.getCategory(), dto.getTags())
        );
        return CreateResponse.from(boardEntity);
    }

    @Override
    public GetResponseWithComment getBoard(Long boardId) {
        BoardEntity entity = boardRepository.findById(boardId).orElseThrow();
        List<CommentDto> responseComments = commentClient.getComments(boardId);

        Long viewCount = boardCountService.incrementViewCount(boardId);
        Long likeCount = boardCountService.getLikeCount(boardId);

        return GetResponseWithComment.from(entity, responseComments, viewCount, likeCount);
    }

    @Override
    public Page<PageResponse> getPage(Category category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("boardId").descending());

        Page<BoardEntity> boards;
        if (category == null) {
            boards = boardRepository.findAll(pageable);
        } else {
            boards = boardRepository.findByCategory(category, pageable);
        }

        return boards.map(board -> {
            Long viewCount = boardCountService.getViewCount(board.getBoardId());
            Long likeCount = boardCountService.getLikeCount(board.getBoardId());
            return PageResponse.from(board, viewCount, likeCount);
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
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();

        Long userId = SecurityUtil.getCurrentUserId(request);
        if (!boardEntity.getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한 없음");
        }

        boardEntity.update(dto.getTitle(), dto.getContent(), dto.getCategory(), dto.getTags());

        Long viewCount = boardCountService.getViewCount(boardId);
        Long likeCount = boardCountService.getLikeCount(boardId);

        return UpdateResponse.from(boardEntity, viewCount, likeCount);
    }

    @Transactional
    public DeletedResponse delete(Long boardId, HttpServletRequest request) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();

        Long userId = SecurityUtil.getCurrentUserId(request);
        if (!boardEntity.getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한 없음");
        }

        boardRepository.deleteById(boardId);

        BoardDeleteEvent event = new BoardDeleteEvent(boardId, LocalDateTime.now());
        kafkaProducer.send("board.deleted", event);

        return DeletedResponse.from();
    }

    @Override
    public Long like(Long boardId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return boardCountService.like(boardId, userId);
    }

    @Override
    public Long unlike(Long boardId, HttpServletRequest request) {
        Long userId = SecurityUtil.getCurrentUserId(request);
        return boardCountService.unlike(boardId, userId);
    }
}