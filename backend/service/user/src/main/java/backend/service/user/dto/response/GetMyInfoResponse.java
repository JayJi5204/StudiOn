package backend.service.user.dto.response;

import backend.service.user.dto.other.BoardDto;
import backend.service.user.dto.other.CommentDto;
import backend.service.user.entity.UserEntity;
import backend.common.enumType.UserRole;
import lombok.Getter;

import java.util.List;

@Getter
public class GetMyInfoResponse {

    private String email;
    private String nickName;
    private String userId;
    private String phoneNumber;
    private UserRole role;
    private String bio;
    private List<BoardDto> boards;
    private List<CommentDto> comments;

    public static GetMyInfoResponse from(UserEntity entity,
                                       List<BoardDto> responseBoards,
                                       List<CommentDto> responseComments) {
        GetMyInfoResponse dto = new GetMyInfoResponse();
        dto.email = entity.getEmail();
        dto.nickName = entity.getNickName();
        dto.userId = String.valueOf(entity.getUserId());
        dto.phoneNumber = entity.getPhoneNumber();
        dto.role = entity.getRole();
        dto.bio = entity.getBio();
        dto.boards = responseBoards;
        dto.comments = responseComments;
        return dto;
    }
}
