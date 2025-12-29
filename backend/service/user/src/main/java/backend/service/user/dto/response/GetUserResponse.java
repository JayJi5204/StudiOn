package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

import java.util.List;


@Getter
public class GetUserResponse {
    private String email;
    private String username;
    private Long userId;
    private UserRole role;
    private List<ResponseBoard> board; // 이 필드에 데이터를 채워야 합니다.

    public static GetUserResponse from(UserEntity entity, List<ResponseBoard> responseBoards) {
        GetUserResponse dto = new GetUserResponse();
        dto.email = entity.getEmail();
        dto.username = entity.getUsername();
        dto.userId = entity.getUserId();
        dto.role = entity.getRole();
        dto.board = responseBoards;

        return dto;
    }
}
