package backend.service.user.repository;

import backend.service.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    UserEntity findByEmail(String email);
    UserEntity findByUserId(Long userId);
    List<UserEntity> findAllByIsDeletedFalse();
}
