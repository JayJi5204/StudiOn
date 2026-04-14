package backend.service.board.entity;

import backend.service.board.converter.StringListConverter;
import backend.common.enumType.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
@Getter
@NoArgsConstructor
public class BoardEntity {

    @Id
    private Long boardId;
    private Long userId;
    private String nickName;
    private String title;
    private String content;
    private Long viewCount;
    private Long likeCount;
    @Enumerated(EnumType.STRING)
    private Category category;
    @Convert(converter = StringListConverter.class)
    private List<String> tags;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime modifiedAt;

    public static BoardEntity create(Long boardId,Long userId, String nickName, String title, String content, Category category, List<String> tags) {
        BoardEntity boardEntity = new BoardEntity();
        boardEntity.boardId = boardId;
        boardEntity.userId = userId;
        boardEntity.nickName = nickName;
        boardEntity.title = title;
        boardEntity.content = content;
        boardEntity.category = category;
        boardEntity.viewCount = 0L;
        boardEntity.likeCount = 0L;
        boardEntity.createdAt = LocalDateTime.now();
        boardEntity.modifiedAt = boardEntity.createdAt;
        boardEntity.tags = tags != null ? tags : new ArrayList<>();
        return boardEntity;
    }

    public void update(String title, String content, Category category, List<String> tags) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.modifiedAt = LocalDateTime.now();
    }

    public void syncCounts(Long viewCount, Long likeCount) {
        this.viewCount = viewCount;
        this.likeCount = likeCount;
    }
}
