package backend.service.board.repository;

import backend.service.board.entity.BoardEntity;
import backend.service.board.enumType.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    Page<BoardEntity> findAll(Pageable pageable);

    Page<BoardEntity> findByCategory(Category category, Pageable pageable);

    List<BoardEntity> findAllByUserId(Long userId);
}