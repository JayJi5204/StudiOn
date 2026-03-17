package backend.service.user.dto.response;

import backend.service.user.dto.otherDto.BoardDto;
import backend.service.user.dto.otherDto.CommentDto;
import backend.service.user.entity.UserEntity;
import backend.service.user.enumType.UserRole;
import lombok.Getter;

import java.util.List;

@Getter
public class GetMyInfoResponse {

    private String email;
    private String username;
    private String userId;
    private UserRole role;
    private List<BoardDto> boards;
    private List<CommentDto> comments;

    public static GetMyInfoResponse from(UserEntity entity,
                                       List<BoardDto> responseBoards,
                                       List<CommentDto> responseComments) {
        GetMyInfoResponse dto = new GetMyInfoResponse();
        dto.email = entity.getEmail();
        dto.username = entity.getUsername();
        dto.userId = String.valueOf(entity.getUserId());
        dto.role = entity.getRole();
        dto.boards = responseBoards;
        dto.comments = responseComments;
        return dto;
    }
}
