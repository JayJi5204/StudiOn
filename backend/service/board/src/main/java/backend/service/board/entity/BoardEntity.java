package backend.service.board.entity;

import backend.service.board.enumType.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.repository.Modifying;

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
    @CreatedDate
    private LocalDateTime createAt;
    @LastModifiedDate
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

    public void update(String title, String content, Category category) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.modifiedAt = LocalDateTime.now();
    }
}
