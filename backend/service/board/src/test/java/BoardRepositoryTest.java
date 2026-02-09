import backend.service.board.entity.BoardEntity;
import backend.service.board.repository.BoardRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
public class BoardRepositoryTest {

    @Autowired
    BoardRepository boardRepository;

    @Test
    void findAllTest(){
        List<BoardEntity> boardEntityList=boardRepository.findAll(1L,1L,1L);
        log.info("size = "+boardEntityList.size());
        for (BoardEntity boardEntity : boardEntityList) {
            log.info("board = {}",boardEntity);
        }
    }
}
