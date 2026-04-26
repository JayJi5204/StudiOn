package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GetAllResponse {
    private String userId;
    private String email;
    private String nickName;
    private String role;
    private Boolean isDeleted;
    private LocalDateTime createdAt;

    public static GetAllResponse from(UserEntity entity) {
        GetAllResponse dto = new GetAllResponse();
        dto.userId = String.valueOf(entity.getUserId());
        dto.email = entity.getEmail();
        dto.nickName = entity.getNickName();
        dto.role = entity.getRole().name();
        dto.isDeleted = entity.getIsDeleted();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }
}