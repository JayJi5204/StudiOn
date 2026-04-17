package backend.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U002", "비밀번호가 올바르지 않습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U003", "이미 사용 중인 이메일입니다."),

    // Board
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "B001", "게시글을 찾을 수 없습니다."),
    BOARD_UNAUTHORIZED(HttpStatus.FORBIDDEN, "B002", "게시글 수정/삭제 권한이 없습니다."),
    ALREADY_LIKED(HttpStatus.CONFLICT, "B003", "이미 좋아요한 게시글입니다."),
    NOT_LIKED(HttpStatus.BAD_REQUEST, "B004", "좋아요하지 않은 게시글입니다."),

    // Comment
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "댓글을 찾을 수 없습니다."),
    COMMENT_UNAUTHORIZED(HttpStatus.FORBIDDEN, "C002", "댓글 수정/삭제 권한이 없습니다."),
    ALREADY_LIKED_COMMENT(HttpStatus.CONFLICT, "C003", "이미 좋아요한 댓글입니다."),
    NOT_LIKED_COMMENT(HttpStatus.BAD_REQUEST, "C004", "좋아요하지 않은 댓글입니다."),

    // Room
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "방을 찾을 수 없습니다."),
    ROOM_FULL(HttpStatus.BAD_REQUEST, "R002", "방이 꽉 찼습니다."),
    ROOM_UNAUTHORIZED(HttpStatus.FORBIDDEN, "R003", "방 초대 권한이 없습니다."),
    INVALID_PASSWORD_ROOM(HttpStatus.UNAUTHORIZED, "R004", "비밀번호가 틀렸습니다."),
    INVALID_INVITE_CODE(HttpStatus.NOT_FOUND, "R005", "유효하지 않은 초대코드입니다."),
    ALREADY_IN_ROOM(HttpStatus.CONFLICT, "R006", "이미 다른 방에 입장중입니다."),

    // Chat & GroupChat
    INVALID_ROOM_ID(HttpStatus.BAD_REQUEST, "CH001", "유효하지 않은 채팅방 ID입니다."),
    INVALID_MESSAGE(HttpStatus.BAD_REQUEST, "CH002", "메시지 내용이 없습니다."),
    MESSAGE_TOO_LONG(HttpStatus.BAD_REQUEST, "CH003", "메시지는 300자 이하여야 합니다."),
    GROUP_MESSAGE_TOO_LONG(HttpStatus.BAD_REQUEST, "CH004", "메시지는 500자 이하여야 합니다."),

    // Alarm
    ALARM_NOT_FOUND(HttpStatus.NOT_FOUND, "A001", "알림을 찾을 수 없습니다."),

    // Auth
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH001", "인증 정보가 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH002", "유효하지 않은 토큰입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}