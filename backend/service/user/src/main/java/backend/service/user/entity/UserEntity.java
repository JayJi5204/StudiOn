package backend.service.user.entity;

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
    private Long id;

    @Column(nullable = false, unique = true)
    private String userKey;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(nullable = false,  unique = true)
    private String password;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @CreatedDate
    private LocalDateTime createAt;

    public static UserEntity create(Long id, String userId, String userName, String encryptedPwd, String email) {

        UserEntity entity=new UserEntity();
        entity.id = id;
        entity.userKey = userId;
        entity.userName = userName;
        entity.password = encryptedPwd;
        entity.email = email;
        entity.createAt = LocalDateTime.now();

        return  entity;
    }

    public void  update(String userName, String encryptedPwd,String email){
        this.userName=userName;
        this.password =encryptedPwd;
        this.email=email;
    }
}
