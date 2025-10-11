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
import kuke.board.common.snowflake.Snowflake;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final Snowflake snowflake = new Snowflake();
    private final BoardRepository boardRepository;


    @Transactional
    public BoardResponseDto create(BoardCreateRequestDto boardCreateRequestDto) {
        BoardEntity boardEntity = boardRepository.save(
                BoardEntity.create(snowflake.nextId(), boardCreateRequestDto.getBoardKey(), boardCreateRequestDto.getTitle(), boardCreateRequestDto.getContent())

        );
        return BoardResponseDto.from(boardEntity);
    }

    @Transactional
    public BoardResponseDto update(Long boardId, BoardUpdateRequestDto boardUpdateRequestDto) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow();
        boardEntity.update(boardUpdateRequestDto.getTitle(), boardUpdateRequestDto.getContent());
        return BoardResponseDto.from(boardEntity);
    }

    public BoardResponseDto read(Long boardId) {
        return BoardResponseDto.from(boardRepository.findById(boardId).orElseThrow());
    }


    @Transactional
    public void delete(Long boardId) {
        boardRepository.deleteById(boardId);
    }

    @Override
    public PageResponseDto readAll(Long boardKey, Long page, Long pageSize) {
        return PageResponseDto.of(
                boardRepository.findAll(boardKey, (page - 1) * pageSize, pageSize).stream()
                        .map(BoardResponseDto::from)
                        .toList(),
                boardRepository.count(boardKey, PageLimitCalculator.calculatePageLimit(page, pageSize, 10L))
        );
    }

}
