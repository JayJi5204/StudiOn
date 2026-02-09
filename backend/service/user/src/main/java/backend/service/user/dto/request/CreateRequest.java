package backend.service.user.dto.request;

import lombok.Data;

@Data
public class CreateRequest {
    private String email;

    private String username;

    private String password;


}