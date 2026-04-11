package backend.service.user.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtil {

    public ResponseCookie createAccessTokenCookie(String token) {
        return createCookie("accessToken", token, 7 * 24 * 60 * 60);
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

    public String getCookieValue(HttpServletRequest request, String key) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(key))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}