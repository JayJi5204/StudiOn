package backend.service.user.dto.kafka;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Payload {

    private Long userId;

    private String email;

    private String username;

    private String createAt;

    private boolean  isDeleted;

    private String role;

}
