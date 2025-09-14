package com.studion.apiservice.apigateway_service.config;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

//@Configuration
public class FilterConfig {
    Environment env;

    public FilterConfig(Environment env) {
        this.env = env;
    }

//    @Bean
    public RouteLocator getRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(r -> r.path("/board-service/**").
                        filters(f -> f.addRequestHeader("board-request", "board-request-header").
                                addResponseHeader("board-response", "board-response-header")).
                        uri("http://localhost:8081"))
                .route(r -> r.path("/videoroom-service/**").
                        filters(f -> f.addRequestHeader("videoroom-request", "videoroom-request-header").
                                addResponseHeader("videoroom-response", "videoroom-response-header")).
                        uri("http://localhost:8082"))

                .build();
    }
}
