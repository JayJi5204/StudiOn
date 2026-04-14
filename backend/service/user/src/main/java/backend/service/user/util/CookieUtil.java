package backend.service.user.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtil {

    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public CookieUtil(
            @Value("${jwt.access-expiration-time}") long accessTokenExpiration,
            @Value("${jwt.refresh-expiration-time}") long refreshTokenExpiration
    ) {
        // JWT는 ms, 쿠키는 초 단위라 1000으로 나눔
        this.accessTokenExpiration = accessTokenExpiration / 1000;
        this.refreshTokenExpiration = refreshTokenExpiration / 1000;
    }


    public ResponseCookie createAccessTokenCookie(String token) {
        return createCookie("accessToken", token, accessTokenExpiration);
    }

    public ResponseCookie createRefreshTokenCookie(String token) {
        return createCookie("refreshToken", token, refreshTokenExpiration);
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