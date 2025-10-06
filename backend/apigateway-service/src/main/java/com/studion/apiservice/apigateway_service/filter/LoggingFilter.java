package com.studion.apiservice.apigateway_service.filter;

import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.OrderedGatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@Log4j2
public class LoggingFilter extends AbstractGatewayFilterFactory<LoggingFilter.Config> {

    public LoggingFilter() { super(Config.class); }

//    @Override
//    public GatewayFilter apply(Config config) {
//        return (exchange, chain) -> {
//         ServerHttpRequest request= exchange.getRequest();
//         ServerHttpResponse response= exchange.getResponse();
//            log.info("Logging Filter baseMessage : {}, {}", config.getBaseMessage(), request.getRemoteAddress());
//
//            if(config.isPreLogger()){
//            log.info("Logging Filter Start : request uri -> {}",request.getURI());
//            }
//
//            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
//                if(config.isPostLogger()){
//
//                log.info("Logging POST End: response code -> {}",response.getStatusCode());
//                }
//            }));
//        };
//    }

    @Override
    public GatewayFilter apply(LoggingFilter.Config config) {

        GatewayFilter filter=new OrderedGatewayFilter((exchange, chain) -> {
            ServerHttpRequest request= exchange.getRequest();
            ServerHttpResponse response= exchange.getResponse();
            log.info("Logging Filter baseMessage : {}, {}", config.getBaseMessage(), request.getRemoteAddress());

            if(config.isPreLogger()){
                log.info("Logging Filter Start : request id -> {}",request.getId());
            }

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                if(config.isPostLogger()){

                    log.info("Logging POST End: response code -> {}",response.getStatusCode());
                }
            }));
        }, OrderedGatewayFilter.HIGHEST_PRECEDENCE);
        return filter;
    }

    @Data
    public static class Config {
        private String baseMessage;
        private boolean preLogger;
        private boolean postLogger;
    }
}
