package backend.api.gateway.filter;

import io.jsonwebtoken.Claims;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
@Log4j2
public class AuthorizationHeaderFilter
        extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {

    private final JwtValidator jwtValidator;

    // 공통 상수로 관리하는 것을 권장합니다.
    private static final String HEADER_USER_ID = "X-User-ID";
    private static final String HEADER_USER_EMAIL = "X-User-Email";
    private static final String HEADER_USER_ROLE = "X-User-Role";

    public AuthorizationHeaderFilter(JwtValidator jwtValidator) {
        super(Config.class);
        this.jwtValidator = jwtValidator;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 1. 기존 Authorization 헤더 확인
            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authorizationHeader == null || !authorizationHeader.toLowerCase().startsWith("bearer ")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization header missing");
            }

            String token = authorizationHeader.substring(7);

            // 2. JWT 검증
            Claims claims;
            try {
                claims = jwtValidator.validate(token);
            } catch (Exception e) {
                log.error("JWT Validation failed: {}", e.getMessage());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
            }

            String userId = claims.getSubject();
            String email = claims.get("email", String.class);
            String role = claims.get("role", String.class);

            // 3. Request 수정 (Mutate)
            ServerHttpRequest modifiedRequest = request.mutate()
                    .headers(httpHeaders -> {
                        // 1. 보안을 위해 기존에 외부에서 들어온 헤더들을 모두 삭제
                        httpHeaders.remove(HEADER_USER_ID);
                        httpHeaders.remove(HEADER_USER_EMAIL);
                        httpHeaders.remove(HEADER_USER_ROLE);

                        // 2. 내부 서비스로 전달할 때는 원본 Authorization 토큰을 삭제
                        httpHeaders.remove(HttpHeaders.AUTHORIZATION);
                    })
                    // 3. 검증된 정보를 새로운 헤더로 주입
                    .header(HEADER_USER_ID, userId)
                    .header(HEADER_USER_EMAIL, email)
                    .header(HEADER_USER_ROLE, role)
                    .build();

            log.info("Gateway: Authenticated User={}, Role={}", userId, role);

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    public static class Config {}
}