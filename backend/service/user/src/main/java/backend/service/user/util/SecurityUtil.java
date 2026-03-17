package backend.service.user.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Long getCurrentUserId() {

        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal == null) {
            throw new RuntimeException("인증 정보 없음");
        }

        return Long.valueOf((String) principal);
    }
}