package backend.service.user.repository;

import backend.service.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    UserEntity findByEmail(String email);
    UserEntity findUserByUserKey(String userKey);
    UserEntity findByUserId(Long id);

}
