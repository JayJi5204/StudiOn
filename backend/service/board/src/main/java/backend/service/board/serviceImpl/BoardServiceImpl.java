package backend.service.board.serviceImpl;

import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.dto.response.PageResponseDto;
import backend.service.board.common.PageLimitCalculator;
import backend.service.board.dto.request.BoardUpdateRequestDto;
import backend.service.board.dto.response.BoardResponseDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardService;
import jakarta.transaction.Transactional;
import backend.security.common.Snowflake;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;


    @Transactional
    public BoardResponseDto create(BoardCreateRequestDto dto) {
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), dto.getBoardKey(), dto.getUserId(), dto.getTitle(), dto.getContent())

        );
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
        // 1. DB에서 해당 유저의 게시글 엔터티 리스트 조회
        List<BoardEntity> entities = boardRepository.findAllByUserId(userId);

        // 2. Entity 리스트를 DTO 리스트로 변환하여 반환
        // 힌트: entities.stream().map(...) 형식을 사용해 보세요.
        return entities.stream()
                .map(BoardResponseDto::from) // 혹은 직접 빌더/생성자 사용
                .toList();
    }

}
