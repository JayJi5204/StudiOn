import api from "./axios";
import type { ChatMessage, ChatRoom } from "../types/chat.type";

export const chatApi = {
  getRooms: () => api.get<ChatRoom[]>("/chats/rooms"),

  getMessages: (roomId: string, page: number = 0, size: number = 20) =>
    api.get<ChatMessage[]>(`/chats/messages/${roomId}`, {
      params: { page, size },
    }),

  getMessagesBefore: (roomId: string, lastSendAt: string, size: number = 20) =>
    api.get<ChatMessage[]>(`/chats/messages/${roomId}/before`, {
      params: { lastSendAt, size },
    }),

  getRoomId: (userId1: string, userId2: string) =>
    api.get<string>("/chats/room", { params: { userId1, userId2 } }),

  searchUsers: (keyword: string) =>
    api.get("/users/search", { params: { keyword } }),
};
