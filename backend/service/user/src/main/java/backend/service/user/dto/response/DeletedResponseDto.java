package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Getter;

@Getter
public class DeletedResponseDto {
    private Boolean isDeleted;
    private String message;

    public static DeletedResponseDto from(UserEntity entity) {
        DeletedResponseDto dto = new DeletedResponseDto();
        dto.isDeleted=entity.getIsDeleted();
        dto.message = "삭제되었습니다.";
        return dto;
    }

}
