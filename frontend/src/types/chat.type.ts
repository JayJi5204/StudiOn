export interface ChatMessage {
  messageId: string;
  roomId: string;
  userId: string;
  nickName: string;
  message: string;
  sendAt: string;
}

export interface ChatRoom {
  roomId: string;
  partnerId: string;
  partnerNickName: string;
  lastMessage: string;
  lastMessageAt: string;
}

export interface StompMessage {
  type: "CHAT" | "ENTER" | "LEAVE";
  roomId: string;
  senderId: string;
  senderNickName: string;
  content: string;
}
