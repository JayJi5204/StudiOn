package backend.service.board.serviceImpl;

import backend.security.common.Snowflake;
import backend.service.board.common.PageLimitCalculator;
import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;
import backend.service.board.dto.response.GetBoardResponse;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardService;
import backend.service.comment.dto.response.ResponseComment;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import backend.service.board.messageQueue.KafkaProducer;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;
    private final Environment env;
    private final RestTemplate restTemplate;
    private final KafkaProducer kafkaProducer;


    @Transactional
    public BoardResponseDto create(BoardCreateRequestDto dto) {
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), dto.getUserId(), dto.getTitle(), dto.getContent())

        );

        kafkaProducer.send("create-board-topic", dto);
        return BoardResponseDto.from(boardEntity);
    }

    @Transactional
    public BoardResponseDto update(Long boardId, BoardUpdateRequestDto dto) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();
        boardEntity.update(dto.getTitle(), dto.getContent());
        return BoardResponseDto.from(boardEntity);
    }

    public BoardResponseDto getBoards(Long boardId) {
        return BoardResponseDto.from(boardRepository.findById(boardId).orElseThrow());
    }


    @Transactional
    public void delete(Long boardId) {
        boardRepository.deleteById(boardId);
    }

    @Override
    public PageResponseDto getAllBoards(Long boardKey, Long page, Long pageSize) {
        return PageResponseDto.of(
                boardRepository.findAll(boardKey, (page - 1) * pageSize, pageSize).stream()
                        .map(BoardResponseDto::from)
                        .toList(),
                boardRepository.count(boardKey, PageLimitCalculator.calculatePageLimit(page, pageSize, 10L))
        );
    }

    @Override
    public List<BoardResponseDto> getBoardWhoCreate(Long userId) {
        List<BoardEntity> entities = boardRepository.findAllByUserId(userId);

        return entities.stream()
                .map(BoardResponseDto::from) // 혹은 직접 빌더/생성자 사용
                .toList();
    }

    @Override
    public GetBoardResponse getBoard(Long boardId) {
        BoardEntity entity = boardRepository.findBoardsByBoardId(boardId);
        String commentUrl = String.format(env.getProperty("comment-service.url"), boardId);
        ResponseEntity<List<ResponseComment>> responseEntity = restTemplate.exchange(commentUrl, HttpMethod.GET, null, new ParameterizedTypeReference<List<ResponseComment>>() {
        });
        List<ResponseComment> responseComments = responseEntity.getBody();
        return GetBoardResponse.from(entity,responseComments);
    }

}
