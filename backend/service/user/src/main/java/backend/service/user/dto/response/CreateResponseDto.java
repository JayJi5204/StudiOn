package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CreateResponseDto {

    private Long userId;
    private String userName;
    private String email;
    private LocalDateTime createAt;
    private Boolean isDeleted;
    private UserRole role;


    public static CreateResponseDto from(UserEntity entity) {
        CreateResponseDto dto = new CreateResponseDto();
        dto.userId=entity.getUserId();
        dto.userName = entity.getUserName();
        dto.email = entity.getEmail();
        dto.createAt = entity.getCreateAt();
        dto.isDeleted = entity.getIsDeleted();
        dto.role = entity.getRole();
        return dto;
    }
}
