package backend.service.user.repository;

import backend.service.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    UserEntity findByEmail(String email);
    Boolean existsByPassword(String password);
    UserEntity findByUserId(Long userId);

}
