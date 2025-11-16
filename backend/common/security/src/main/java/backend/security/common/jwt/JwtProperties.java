package backend.security.common.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@ConfigurationProperties(prefix = "token")
@Component
public class  JwtProperties {
    private String secret;
    private Long accessExpiration;
    private Long refreshExpiration;
}