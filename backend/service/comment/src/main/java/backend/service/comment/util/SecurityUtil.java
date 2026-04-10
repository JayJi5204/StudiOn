package backend.service.comment.util;

import jakarta.servlet.http.HttpServletRequest;


public class SecurityUtil {

    public static Long getCurrentUserId(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        if (userId == null) throw new RuntimeException("인증 정보 없음");
        return Long.valueOf(userId);
    }
    public static String getNickname(HttpServletRequest request) {
        String nickname = request.getHeader("X-User-Nickname");
        if (nickname == null) throw new RuntimeException("인증 정보 없음");
        return nickname;
    }
}