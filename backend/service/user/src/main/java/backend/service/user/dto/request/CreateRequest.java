package backend.service.user.dto.request;

import lombok.Data;


@Data
public class CreateRequest {
    private String email;

    private String nickName;

    private String password;

    private String adminPassword;

    private String phoneNumber;
}