package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSearchResponse {

    private String userId;
    private String nickName;
    private String email;
    private Boolean isDeleted;
    private LocalDateTime createdAt;

    public static UserSearchResponse from(UserEntity entity) {
        UserSearchResponse dto = new UserSearchResponse();
        dto.userId = String.valueOf(entity.getUserId());
        dto.nickName = entity.getNickName();
        dto.email = entity.getEmail();
        dto.isDeleted = entity.getIsDeleted();
        dto.createdAt = entity.getCreatedAt();
        return dto;
    }
}