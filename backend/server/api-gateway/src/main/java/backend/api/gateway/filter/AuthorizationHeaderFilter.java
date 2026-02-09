package backend.api.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@Log4j2
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {

    private final Environment env;
    private final SecretKey signingKey;

    // API Gateway의 bootstrap.yml에서 가져오는 이름에 맞춰 "token.secret"을 사용합니다.
    private static final String JWT_SECRET_PROPERTY = "token.secret";
    private static final String X_USER_ID_HEADER = "X-User-ID";

    public AuthorizationHeaderFilter(Environment env) {
        super(Config.class);
        this.env = env;

        // 1. Config Server에서 Secret Key를 가져와 SecretKey 인스턴스 생성
        String secret = env.getProperty(JWT_SECRET_PROPERTY);

        // 💡 디버그 코드: Secret Key 로드 상태 확인
        if (secret == null) {
            System.err.println("❌ ERROR: JWT Secret is NULL. Check Config Server connection (8888) and 'config.yml'.");
        } else if (secret.isEmpty()) {
            System.err.println("❌ ERROR: JWT Secret is EMPTY STRING.");
        } else {
            System.out.println("✅ DEBUG: JWT Secret Loaded Successfully. Length: " + secret.length());
        }

        if (secret == null || secret.isEmpty()) {
            log.error("JWT Secret Key is not configured (property: {}). Filter creation failed.", JWT_SECRET_PROPERTY);
            // ❌ 생성자 예외를 일으키는 부분
            throw new IllegalArgumentException("JWT Secret Key is missing or empty. Cannot initialize filter.");
        }

        // 2. SecretKey 객체 생성 (JJWT 0.12.6 문법)
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        System.out.println("✅ DEBUG: AuthorizationHeaderFilter initialized successfully.");
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 1. Authorization 헤더 검사
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            }
            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            String jwt = authorizationHeader.replace("Bearer ", "");

            // 2. JWT 유효성 검증 및 Claims 추출
            Claims claims = getClaimsFromJwt(jwt);
            if (claims == null) {
                return onError(exchange, "JWT token is invalid or expired", HttpStatus.UNAUTHORIZED);
            }

            // 3. 사용자 ID 추출 (Subject를 ID로 가정)
            String userId = claims.getSubject();
            if (userId == null || userId.isEmpty()) {
                return onError(exchange, "JWT claims missing Subject (User ID)", HttpStatus.UNAUTHORIZED);
            }

            // 4. 요청 헤더에 사용자 ID 추가 (내부 서비스 전달용)
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header(X_USER_ID_HEADER, userId)
                    .build();

            // 5. 다음 필터/서비스로 요청 전달
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    // ** JWT 유효성 검증 및 Claims 추출 메서드 (0.12.6 문법 적용) **
    private Claims getClaimsFromJwt(String jwt) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            log.warn("JWT Expired: {}", ex.getMessage());
        } catch (SignatureException ex) {
            log.error("JWT Signature Validation Failed: {}", ex.getMessage());
        } catch (Exception ex) {
            log.error("JWT is not valid: {}", ex.getMessage());
        }
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        log.error(err);

        byte[] bytes = "The requested token is invalid.".getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Flux.just(buffer));
    }

    public static class Config { }
}