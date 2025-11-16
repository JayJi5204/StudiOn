package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CreateResponse {

    private Long userId;
    private String email;
    private String username;
    private LocalDateTime createAt;
    private Boolean isDeleted;
    private UserRole role;


    public static CreateResponse from(UserEntity entity) {
        CreateResponse dto = new CreateResponse();
        dto.userId=entity.getUserId();
        dto.username = entity.getUsername();
        dto.email = entity.getEmail();
        dto.createAt = entity.getCreateAt();
        dto.isDeleted = entity.getIsDeleted();
        dto.role = entity.getRole();
        return dto;
    }
}
