package backend.service.board.serviceImpl;

import backend.security.common.Snowflake;
import backend.service.board.common.PageLimitCalculator;
import backend.service.board.dto.otherDto.CommentDto;
import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponse;
import backend.service.board.dto.response.DeletedResponse;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.feignClient.CommentClient;
import backend.service.board.messageQueue.KafkaProducer;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;
    private final KafkaProducer kafkaProducer;
    private final CommentClient commentClient;


    @Transactional
    public BoardResponse create(BoardCreateRequestDto dto) {
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), dto.getUserId(), dto.getTitle(), dto.getContent(),dto.getCategory())

        );

        kafkaProducer.send("create-board-topic", dto);
        return BoardResponse.from(boardEntity);
    }

    @Transactional
    public BoardResponse update(Long boardId, BoardUpdateRequestDto dto) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();
        boardEntity.update(dto.getTitle(), dto.getContent());
        return BoardResponse.from(boardEntity);
    }

    public BoardResponse getBoards(Long boardId) {
        return BoardResponse.from(boardRepository.findById(boardId).orElseThrow());
    }


    @Transactional
    public DeletedResponse delete(Long boardId) {
        boardRepository.deleteById(boardId);
        return DeletedResponse.from();

    }

    @Override
    public PageResponseDto getAllBoards(Long boardKey, Long page, Long pageSize) {
        return PageResponseDto.of(
                boardRepository.findAll(boardKey, (page - 1) * pageSize, pageSize).stream()
                        .map(BoardResponse::from)
                        .toList(),
                boardRepository.count(boardKey, PageLimitCalculator.calculatePageLimit(page, pageSize, 10L))
        );
    }

    @Override
    public List<BoardResponse> getBoardWhoCreate(Long userId) {
        List<BoardEntity> entities = boardRepository.findAllByUserId(userId);

        return entities.stream()
                .map(BoardResponse::from)
                .toList();
    }

    @Override
    public GetBoardResponse getBoard(Long boardId) {
        BoardEntity entity = boardRepository.findBoardsByBoardId(boardId);
        List<CommentDto> responseComments = commentClient.getComments(boardId);

        return GetBoardResponse.from(entity, responseComments);
    }

}
