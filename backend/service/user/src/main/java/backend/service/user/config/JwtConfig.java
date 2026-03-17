package backend.service.user.config;

import backend.common.jwt.JwtUtil;
import backend.common.jwt.JwtValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public JwtValidator jwtValidator(@Value("${jwt.secret}") String secret) {
        return new JwtValidator(secret);
    }
    @Bean
    public JwtUtil jwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration-time}") long accessTokenExpiration,
            @Value("${jwt.refresh-expiration-time}") long refreshTokenExpiration
    ) {
        return new JwtUtil(secret, accessTokenExpiration, refreshTokenExpiration);
    }
}