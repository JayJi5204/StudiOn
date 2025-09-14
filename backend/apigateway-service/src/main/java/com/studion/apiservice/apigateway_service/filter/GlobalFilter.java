package com.studion.apiservice.apigateway_service.filter;

import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.OrderedGatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@Log4j2
public class GlobalFilter extends AbstractGatewayFilterFactory<GlobalFilter.Config> {

    public GlobalFilter() { super(Config.class); }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
         ServerHttpRequest request= exchange.getRequest();
         ServerHttpResponse response= exchange.getResponse();
            log.info("Global Filter baseMessage : {}, {}", config.getBaseMessage(), request.getRemoteAddress());

            if(config.isPreLogger()){
            log.info("Global Filter Start : request id -> {}",request.getId());
            }

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                if(config.isPostLogger()){

                log.info("Global POST End: response code -> {}",response.getStatusCode());
                }
            }));
        };
    }



    @Data
    public static class Config {
        private String baseMessage;
        private boolean preLogger;
        private boolean postLogger;
    }
}
