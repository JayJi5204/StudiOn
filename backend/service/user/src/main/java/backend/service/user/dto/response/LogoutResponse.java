package backend.service.user.dto.response;

import backend.service.user.entity.UserEntity;
import lombok.Getter;

@Getter
public class LogoutResponse {
    private Boolean isLogin;
    private String message;

    public static LogoutResponse from(UserEntity entity) {
        LogoutResponse dto = new LogoutResponse();
        dto.isLogin=entity.getIsLogin();
        dto.message = "로그아웃 되었습니다.";
        return dto;
    }

}
