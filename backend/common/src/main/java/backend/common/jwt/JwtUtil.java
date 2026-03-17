package backend.common.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import jakarta.annotation.PostConstruct;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration-time}") long accessTokenExpiration,
            @Value("${jwt.refresh-expiration-time}") long refreshTokenExpiration
    ) {
        // 💡 수정된 부분: Keys.hmacShaKeyFor를 사용하여 SecretKey를 생성합니다.
        // 이 방식이 String Secret을 안전하게 처리하는 최신 JJWT 권장 방식입니다.
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    @PostConstruct
    public void test() {
        System.out.println("=== JwtUtil Loaded ===");
        // Secret Key는 민감 정보이므로 전체 출력 대신 로드 성공 여부만 확인하는 것이 좋습니다.
        System.out.println("SecretKey initialized successfully.");
        System.out.println("accessTokenExpiration = " + accessTokenExpiration);
        System.out.println("refreshTokenExpiration = " + refreshTokenExpiration);
    }

    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public boolean isExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }

    // 🚨 매개변수에 userId 추가
    public String createAccessToken(String userId, String email, String role) {
        return Jwts.builder()
                .subject(userId) // ✅ User ID를 Subject 클레임으로 설정
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    // 🚨 매개변수에 userId 추가
    public String createRefreshToken(String userId, String email, String role) {
        return Jwts.builder()
                .subject(userId) // ✅ User ID를 Subject 클레임으로 설정
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(secretKey)
                .compact();
    }
}