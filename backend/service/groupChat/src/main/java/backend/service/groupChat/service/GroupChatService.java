package backend.service.groupChat.service;


public interface GroupChatService {
    void sendMessage(Long roomId, String message, Long userId, String nickName);
}