package backend.common.enumType;

public enum AlarmType {

    // 댓글 알람
    COMMENT,

    // 채팅 알람
    CHAT,

    // 스터디룸 초대 알람
    ROOM_INVITE,

    // 스터디 그룹 가입 신청 알람 (회장에게)
    STUDY_JOIN_REQUEST,

    // 스터디 그룹 가입 승인 알람 (신청자에게)
    STUDY_JOIN_ACCEPTED,

    // 스터디 그룹 추방 알람 (추방된 멤버에게)
    STUDY_KICKED,

    // 방 강제 종료 알람 (참여자들에게)
    ROOM_FORCE_DELETED,

    // 게시글 강제 삭제 알람 (작성자에게)
    BOARD_FORCE_DELETED
}