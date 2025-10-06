package com.studion.user_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardResponseDto {

    private String boardId;
    private String title;
    private String content;
    private Long likeCount;
    private String createdAt;


}
