package backend.service.user.util;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    public ResponseCookie createAccessTokenCookie(String token) {
        return createCookie("accessToken", token, 1800);
    }

    public ResponseCookie createRefreshTokenCookie(String token) {
        return createCookie("refreshToken", token, 7 * 24 * 60 * 60);
    }

    public ResponseCookie createCookie(String key, String value, long maxAge) {
        return ResponseCookie.from(key, value)
                .path("/")
                .httpOnly(true)
                .secure(false) // HTTPS 적용 시 필수
                .sameSite("Lax")
                .maxAge(maxAge)
                .build();
    }

    public ResponseCookie deleteCookie(String key) {
        return ResponseCookie.from(key, null)
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .build();
    }
}