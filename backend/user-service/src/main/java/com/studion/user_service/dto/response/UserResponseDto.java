package com.studion.user_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponseDto {

    private String userId;
    private String userName;
    private String email;
}
