package backend.service.board.repository;

import backend.service.board.entity.BoardEntity;
import backend.common.enumType.BoardCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    Page<BoardEntity> findAll(Pageable pageable);

    Page<BoardEntity> findByBoardCategory(BoardCategory boardCategory, Pageable pageable);

    List<BoardEntity> findAllByUserId(Long userId);

    Page<BoardEntity> findByTitleContainingOrContentContaining(
            String title, String content, Pageable pageable);

    Page<BoardEntity> findByBoardCategoryAndTitleContainingOrBoardCategoryAndContentContaining(
            BoardCategory category1, String title,
            BoardCategory category2, String content,
            Pageable pageable);
}