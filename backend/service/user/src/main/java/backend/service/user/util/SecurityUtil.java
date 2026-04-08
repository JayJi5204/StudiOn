package backend.service.user.util;

import jakarta.servlet.http.HttpServletRequest;


public class SecurityUtil {

    public static Long getCurrentUserId(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        if (userId == null) throw new RuntimeException("인증 정보 없음");
        return Long.valueOf(userId);
    }
}