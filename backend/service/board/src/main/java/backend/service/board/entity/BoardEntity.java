package backend.service.board.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@NoArgsConstructor
public class BoardEntity {

    @Id
    private Long boardId;
    private Long boardKey;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;

    public static BoardEntity create(Long boardId, Long boardKey, String title, String content) {
        BoardEntity boardEntity = new BoardEntity();
        boardEntity.boardId = boardId;
        boardEntity.boardKey = boardKey;
        boardEntity.title = title;
        boardEntity.content = content;
        boardEntity.createAt = LocalDateTime.now();
        boardEntity.modifiedAt = boardEntity.createAt;
        return boardEntity;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
        this.modifiedAt = LocalDateTime.now();
    }
}
