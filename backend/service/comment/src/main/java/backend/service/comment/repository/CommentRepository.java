package backend.service.comment.repository;

import backend.service.comment.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Query(value = """
            select c from CommentEntity c where c.commentPath.path = :path
            """)
    Optional<CommentEntity> findByPath(@Param("path") String path);


    @Query(value = """
            select path from comment
            where board_id = :boardId and path > :pathPrefix and path like :pathPrefix%
            order by path desc limit 1
            """, nativeQuery = true)
    Optional<String> findDescendantsTopPath(@Param("boardId") Long boardId, @Param("pathPrefix") String pathPrefix);

    @Query(value = """
            select comment.comment_id, comment.content, comment.path, comment.board_id, comment.user_id, comment.is_delete, comment.create_at
            from (
                select comment_id from comment where board_id = :boardId
                order by path asc
                limit :limit offset :offset
                ) t left join comment on t.comment_id = comment.comment_id
            """, nativeQuery = true)
    List<CommentEntity> findAll(@Param("boardId") Long boardId, @Param("offset") Long offset, @Param("limit") Long limit);


    @Query(value = """
            select count(*) from (
            select comment_id from comment where board_id = :boardId limit :limit
            ) t
            """,nativeQuery = true)
    Long count(@Param("boardId") Long boardId, @Param("limit") Long limit);


    @Query(value = """
            select comment.comment_id, comment.content, comment.path, comment.board_id, comment.user_id, comment.is_delete, comment.create_at
            from comment
            where board_id = :boardId
            order by path asc
            limit :limit
            """, nativeQuery = true)
    List<CommentEntity> findAllInfiniteScroll(@Param("boardId") Long boardId, @Param("limit") Long limit);


    @Query(value = """
            select comment.comment_id, comment.content, comment.path, comment.board_id, comment.user_id, comment.is_delete, comment.create_at
            from comment
            where board_id = :boardId and path > :lastPath
            order by path asc
            limit :limit
            """, nativeQuery = true)
    List<CommentEntity> findAllInfiniteScroll(@Param("boardId") Long boardId, @Param("lastPath") String lastPath, @Param("limit") Long limit);

}
