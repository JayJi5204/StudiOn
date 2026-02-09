package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Getter;

@Getter
public class DeletedResponse {
    private Boolean isDeleted;
    private String message;

    public static DeletedResponse from(UserEntity entity) {
        DeletedResponse dto = new DeletedResponse();
        dto.isDeleted=entity.getIsDeleted();
        dto.message = "삭제되었습니다.";
        return dto;
    }

}
