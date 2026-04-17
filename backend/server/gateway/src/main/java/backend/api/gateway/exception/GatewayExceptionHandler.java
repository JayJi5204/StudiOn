package backend.api.gateway.exception;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.core.io.buffer.DataBuffer;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
@Order(-2)
public class GatewayExceptionHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().add("Content-Type", "application/json");

        HttpStatus status;
        String code;
        String message;

        if (ex.getMessage() != null && ex.getMessage().contains("Authorization")) {
            status = HttpStatus.UNAUTHORIZED;
            code = "AUTH001";
            message = "인증 정보가 없습니다.";
        } else if (ex.getMessage() != null && ex.getMessage().contains("No servers available")) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            code = "SERVICE_UNAVAILABLE";
            message = "서비스를 사용할 수 없습니다.";
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            code = "INTERNAL_SERVER_ERROR";
            message = "서버 오류가 발생했습니다.";
        }

        response.setStatusCode(status);

        String body = String.format(
                "{\"status\":%d,\"code\":\"%s\",\"message\":\"%s\"}",
                status.value(), code, message
        );

        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }
}