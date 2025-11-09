package backend.service.user.entity;

import backend.service.user.enumType.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
public class UserEntity {

    @Id
    private Long userId;

    @Column(nullable = false, unique = true)
    private String userKey;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @CreatedDate
    private LocalDateTime createAt;

    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public static UserEntity create(Long id, String userId, String userName, String password, String email) {

        UserEntity entity = new UserEntity();
        entity.userId = id;
        entity.userKey = userId;
        entity.userName = userName;
        entity.password = password;
        entity.email = email;
        entity.createAt = LocalDateTime.now();
        entity.isDeleted = false;
        entity.role = UserRole.USER;

        return entity;
    }

    public void update(String userName, String password, String email) {
        this.userName = userName;
        this.password = password;
        this.email = email;
    }

    public void delete(){
        this.isDeleted=true;
    }

}
