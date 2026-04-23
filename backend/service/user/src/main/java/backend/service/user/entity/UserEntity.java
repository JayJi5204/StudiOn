package backend.service.user.entity;

import backend.common.enumType.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class UserEntity {

    @Id
    private Long userId;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickName;

    private String phoneNumber;

    private String profileAvatar;

    private Long studyTime;

    private LocalDateTime createdAt;

    private Boolean isDeleted;

    private Boolean isLoggedIn;

    private String bio;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public static UserEntity create(Long userId, String nickName, String password, String email, String phoneNumber) {

        UserEntity entity = new UserEntity();
        entity.userId = userId;
        entity.nickName = nickName;
        entity.password = password;
        entity.email = email;
        entity.createdAt = LocalDateTime.now();
        entity.isDeleted = false;
            entity.role = UserRole.USER;
        entity.phoneNumber = phoneNumber;
        entity.isLoggedIn = false;
        entity.studyTime = 0L;
        entity.bio = "";

        return entity;
    }

    public void update(String nickName, String password, String email,String phoneNumber,String bio) {
        this.nickName = nickName;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.bio=bio;

    }

    public void delete() {
        this.isDeleted = true;
    }

    public void login() {
        this.isLoggedIn = true;
    }

    public void logout(){
        this.isLoggedIn = false;
    }

    public void addStudyTime(Long minutes) {
        this.studyTime += minutes;
    }
}
