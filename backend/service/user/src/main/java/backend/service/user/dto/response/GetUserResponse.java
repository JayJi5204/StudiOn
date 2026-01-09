package backend.service.user.dto.response;

import backend.service.board.dto.response.ResponseBoard;
import backend.service.comment.dto.response.ResponseComment;
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
    private List<ResponseBoard> boards;
    private List<ResponseComment> comments;

    public static GetUserResponse from(UserEntity entity, List<ResponseBoard> responseBoards, List<ResponseComment> responseComments) {
        GetUserResponse dto = new GetUserResponse();
        dto.email = entity.getEmail();
        dto.username = entity.getUsername();
        dto.userId = entity.getUserId();
        dto.role = entity.getRole();
        dto.boards = responseBoards;
        dto.comments = responseComments;
        return dto;
    }
}
