package backend.service.comment.repository;

import backend.service.comment.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {


    @Query(value = """
            select count(*) from (
            select comment_id from comment
            where board_id + :boardId and parent_comment_id = :parentCommentId
            limit :limit
            ) t
            """, nativeQuery = true)
    Long countBy(@Param("boardId") Long boardId, @Param("parentCommentId") Long parentCommentId, @Param("limit") Long limit);

}
