import backend.service.board.dto.request.BoardCreateRequestDto;
import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import backend.service.board.service.BoardService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
public class BoardServiceTest {

    @Autowired
    BoardService boardService;

    @Test
    void create(){

    }
}
