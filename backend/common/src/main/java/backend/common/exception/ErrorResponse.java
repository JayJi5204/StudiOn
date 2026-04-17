package backend.common.exception;

import lombok.Data;

@Data
public class ErrorResponse {

    private int status;
    private String code;
    private String message;

    public static ErrorResponse from(ErrorCode errorCode) {
        ErrorResponse response = new ErrorResponse();
        response.status = errorCode.getHttpStatus().value();
        response.code = errorCode.getCode();
        response.message = errorCode.getMessage();
        return response;
    }
}