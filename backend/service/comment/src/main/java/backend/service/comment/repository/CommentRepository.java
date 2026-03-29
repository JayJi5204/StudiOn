package backend.service.comment.repository;

import backend.service.comment.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Query(value = "select c from CommentEntity c where c.commentPath.path = :path")
    Optional<CommentEntity> findByPath(@Param("path") String path);

    @Query(value = """
            select path from comments
            where board_id = :boardId and path > :pathPrefix and path like :pathPrefix%
            order by path desc limit 1
            """, nativeQuery = true)
    Optional<String> findDescendantsTopPath(@Param("boardId") Long boardId, @Param("pathPrefix") String pathPrefix);

    // 무한 스크롤 첫 조회
    List<CommentEntity> findByBoardIdOrderByCommentPathPathAsc(Long boardId, Pageable pageable);

    // 무한 스크롤 lastPath 이후
    List<CommentEntity> findByBoardIdAndCommentPathPathGreaterThanOrderByCommentPathPathAsc(Long boardId, String lastPath, Pageable pageable);

    List<CommentEntity> findAllByBoardId(Long boardId);

    List<CommentEntity> findAllByUserId(Long userId);

    void deleteByBoardId(Long boardId);
}