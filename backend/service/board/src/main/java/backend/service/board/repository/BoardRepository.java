package backend.service.board.repository;

import backend.service.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    @Query(value = """
        SELECT b.board_id, b.board_Key, b.title, b.content, b.create_at, b.modified_at
        FROM (
            SELECT board_id
            FROM board
            WHERE board_key = :boardKey
            ORDER BY board_id DESC
            LIMIT :limit OFFSET :offset
        ) t
        LEFT JOIN board b ON t.board_id = b.board_id
        """, nativeQuery = true
    )
    List<BoardEntity> findAll(
            @Param("boardKey") Long boardKey,
            @Param("offset") Long offset,
            @Param("limit") Long limit
    );

    @Query(value = """
        SELECT COUNT(*)
        FROM (
            SELECT board_id
            FROM board
            WHERE board_key = :boardKey
            LIMIT :limit
        ) t
        """, nativeQuery = true
    )
    Long count(
            @Param("boardKey") Long boardKey,
            @Param("limit") Long limit
    );
}