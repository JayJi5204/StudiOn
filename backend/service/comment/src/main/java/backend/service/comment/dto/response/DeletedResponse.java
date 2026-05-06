package backend.service.comment.dto.response;

import lombok.Getter;

@Getter
public class DeletedResponse {
    private String message;

    public static DeletedResponse from() {
        DeletedResponse dto = new DeletedResponse();
        dto.message = "삭제되었습니다.";
        return dto;
    }

}
