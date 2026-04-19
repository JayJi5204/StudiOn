package backend.common.util;

import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;

public class SecurityUtil {

    public static Long getCurrentUserId(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        if (userId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        return Long.valueOf(userId);
    }

    public static String getNickname(HttpServletRequest request) {
        String nickName = request.getHeader("X-User-NickName");
        if (nickName == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        return nickName;
    }

    public static String getCurrentUserRole(HttpServletRequest request) {
        String role = request.getHeader("X-User-Role");
        if (role == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        return role;
    }
}