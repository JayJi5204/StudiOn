package backend.api.gateway.filter;

import io.jsonwebtoken.Claims;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpCookie;
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

            // 1. Authorization 헤더 확인, 없으면 쿠키에서 가져오기
            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader == null) {
                HttpCookie cookie = request.getCookies().getFirst("accessToken");
                if (cookie != null) {
                    authorizationHeader = "Bearer " + cookie.getValue();
                }
            }

            if (authorizationHeader == null || !authorizationHeader.toLowerCase().startsWith("bearer ")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token found");
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

            // 3. Request Mutate
            ServerHttpRequest modifiedRequest = request.mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove(HEADER_USER_ID);
                        httpHeaders.remove(HEADER_USER_EMAIL);
                        httpHeaders.remove(HEADER_USER_ROLE);
                        httpHeaders.remove(HttpHeaders.AUTHORIZATION);
                    })
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