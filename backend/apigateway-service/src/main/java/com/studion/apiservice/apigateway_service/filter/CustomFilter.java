package com.studion.apiservice.apigateway_service.filter;

import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@Log4j2
public class CustomFilter extends AbstractGatewayFilterFactory<CustomFilter.Config> {

    public CustomFilter() { super(Config.class); }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
         ServerHttpRequest request= exchange.getRequest();
         ServerHttpResponse response= exchange.getResponse();

            log.info("Custom PRE Filter: request id -> {}", request.getId());
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                log.info("Custom POST Filter: response code -> {}",response.getStatusCode());
            }));
        };
    }

    public static class Config {

    }
}
