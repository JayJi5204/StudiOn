package backend.common.kafkaEvent.room;

public record RoomInviteEvent(Long invitedUserId, Long hostId, String hostNickName, Long roomId, String roomName) {
}