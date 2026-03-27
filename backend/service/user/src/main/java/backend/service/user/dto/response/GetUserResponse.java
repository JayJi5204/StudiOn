package backend.service.user.dto.response;

import backend.service.user.dto.otherDto.BoardDto;
import backend.service.user.dto.otherDto.CommentDto;
import backend.service.user.entity.UserEntity;
import lombok.Getter;

import java.util.List;

@Getter
public class GetUserResponse {

    private String email;
    private String nickName;
    private List<BoardDto> boards;
    private List<CommentDto> comments;

    public static GetUserResponse from(UserEntity entity,
                                       List<BoardDto> responseBoards,
                                       List<CommentDto> responseComments) {
        GetUserResponse dto = new GetUserResponse();
        dto.email = entity.getEmail();
        dto.nickName = entity.getNickName();
        dto.boards = responseBoards;
        dto.comments = responseComments;
        return dto;
    }
}