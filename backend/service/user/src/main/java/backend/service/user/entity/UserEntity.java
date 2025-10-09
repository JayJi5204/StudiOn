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
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(nullable = false,  unique = true)
    private String encryptedPwd;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @CreatedDate
    private LocalDateTime createAt;

}
