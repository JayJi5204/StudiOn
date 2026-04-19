package backend.api.gateway.filter;

import io.jsonwebtoken.Claims;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
@Log4j2
public class AuthorizationHeaderFilter
        extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {

    private final JwtValidator jwtValidator;

    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_USER_EMAIL = "X-User-Email";
    private static final String HEADER_USER_ROLE = "X-User-Role";
    private static final String HEADER_USER_NICKNAME = "X-User-NickName";

    public AuthorizationHeaderFilter(JwtValidator jwtValidator) {
        super(Config.class);
        this.jwtValidator = jwtValidator;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authorizationHeader == null) {
                HttpCookie cookie = request.getCookies().getFirst("accessToken");
                if (cookie != null) {
                    authorizationHeader = "Bearer " + cookie.getValue();
                }
            }

            if (authorizationHeader == null || !authorizationHeader.toLowerCase().startsWith("bearer ")) {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "AUTH001", "인증 정보가 없습니다.");
            }

            String token = authorizationHeader.substring(7);

            Claims claims;
            try {
                claims = jwtValidator.validate(token);
            } catch (Exception e) {
                log.error("JWT Validation failed: {}", e.getMessage());
                return onError(exchange, HttpStatus.UNAUTHORIZED, "AUTH002", "유효하지 않은 토큰입니다.");
            }

            String userId = claims.getSubject();
            String email = claims.get("email", String.class);
            String role = claims.get("role", String.class);
            String nickName = claims.get("nickName", String.class);

            ServerHttpRequest modifiedRequest = request.mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove(HEADER_USER_ID);
                        httpHeaders.remove(HEADER_USER_EMAIL);
                        httpHeaders.remove(HEADER_USER_ROLE);
                        httpHeaders.remove(HEADER_USER_NICKNAME);
                        httpHeaders.remove(HttpHeaders.AUTHORIZATION);
                    })
                    .header(HEADER_USER_ID, userId)
                    .header(HEADER_USER_EMAIL, email)
                    .header(HEADER_USER_ROLE, role)
                    .header(HEADER_USER_NICKNAME, nickName)
                    .build();

            log.info("Gateway: Authenticated User={}, Role={}", userId, role);

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String code, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");

        String body = String.format(
                "{\"status\":%d,\"code\":\"%s\",\"message\":\"%s\"}",
                status.value(), code, message
        );

        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    public static class Config {}
}