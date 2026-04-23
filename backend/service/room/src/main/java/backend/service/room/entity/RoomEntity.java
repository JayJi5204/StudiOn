package backend.service.room.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomEntity {

    @Id
    private Long roomId;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private Long hostId;

    @Column(nullable = false)
    private int maxPeople;

    @Column(nullable = false)
    private int currentPeople;

    @Column(nullable = false)
    private boolean isPrivate;

    @Column
    private String password;

    @Column(nullable = false, unique = true)
    private String inviteCode;

    private LocalDateTime createdAt;

    public static RoomEntity create(Long roomId, String roomName, Long userId, boolean isPrivate, String password, String inviteCode) {

        if (isPrivate && (password == null || password.isBlank())) {
            throw new RuntimeException("비공개 방은 비밀번호가 필요합니다.");
        }

        RoomEntity roomEntity = new RoomEntity();
        roomEntity.roomId = roomId;
        roomEntity.roomName = roomName;
        roomEntity.hostId = userId;
        roomEntity.maxPeople = 4;
        roomEntity.currentPeople = 0;
        roomEntity.isPrivate = isPrivate;
        roomEntity.password = isPrivate ? password : null;  // isPrivate가 false면 null
        roomEntity.inviteCode = inviteCode;
        roomEntity.createdAt = LocalDateTime.now();
        return roomEntity;
    }
    public void enter() {
        this.currentPeople++;
    }

    public void leave() {
        this.currentPeople--;
    }

    public boolean checkPassword(String inputPassword) {
        return this.password.equals(inputPassword);
    }

}