package backend.service.room.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}