package backend.service.board.entity;

import backend.service.board.enumType.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "boards")
@Getter
@NoArgsConstructor
public class BoardEntity {

    @Id
    private Long boardId;
    private Long userId;
    private String title;
    private String content;
    @Enumerated(EnumType.STRING)
    private Category category;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;

    public static BoardEntity create(Long boardId, Long userId, String title, String content,Category category) {
        BoardEntity boardEntity = new BoardEntity();
        boardEntity.boardId = boardId;
        boardEntity.userId = userId;
        boardEntity.title = title;
        boardEntity.content = content;
        boardEntity.category = category;
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
