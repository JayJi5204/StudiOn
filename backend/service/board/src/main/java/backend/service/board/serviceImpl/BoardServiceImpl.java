package backend.service.board.serviceImpl;

import backend.security.common.Snowflake;
import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.dto.request.CreateRequest;
import backend.service.board.dto.request.UpdateRequest;
import backend.service.board.dto.response.GetResponseWithComment;
import backend.service.board.dto.response.PageResponse;
import backend.service.board.dto.response.DeletedResponse;
import backend.service.board.dto.response.GetResponse;
import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import backend.service.board.feignClient.CommentClient;
import backend.service.board.messageQueue.KafkaProducer;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;
    private final KafkaProducer kafkaProducer;
    private final CommentClient commentClient;


    @Transactional
    public GetResponse create(CreateRequest dto) {
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), dto.getUserId(), dto.getTitle(), dto.getContent(),dto.getCategory())

        );

        kafkaProducer.send("create-board-topic", dto);
        return GetResponse.from(boardEntity);
    }

    @Override
    public Page<PageResponse> getPage(Category category, int page, int size) {

        Pageable pageable =
                PageRequest.of(page, size, Sort.by("boardId").descending());

        Page<BoardEntity> boards;

        if (category == null) {
            boards = boardRepository.findAll(pageable);
        } else {
            boards = boardRepository.findByCategory(category, pageable);
        }

        return boards.map(PageResponse::from);
    }

    @Override
    public GetResponseWithComment getBoard(Long boardId) {
        BoardEntity entity = boardRepository.findById(boardId).orElseThrow();
        List<CommentDto> responseComments = commentClient.getComments(boardId);

        return GetResponseWithComment.from(entity, responseComments);
    }


    @Transactional
    public GetResponse update(Long boardId, UpdateRequest dto) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();
        boardEntity.update(dto.getTitle(), dto.getContent(), dto.getCategory());
        return GetResponse.from(boardEntity);
    }


    @Transactional
    public DeletedResponse delete(Long boardId) {
        boardRepository.deleteById(boardId);
        return DeletedResponse.from();

    }

    @Override
    public List<GetResponse> getBoardWhoCreate(Long userId) {
        List<BoardEntity> entity = boardRepository.findAllByUserId(userId);
        return entity.stream()
                .map(GetResponse::from)
                .toList();
    }


}
