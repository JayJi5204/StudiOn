import api from "./axios";
import type { Room, RoomList, CreateRoomRequest } from "../types/room.type";

export const roomApi = {
  getRooms: (keyword?: string) =>
    api.get<RoomList[]>("/rooms/list", { params: keyword ? { keyword } : {} }),

  getRoom: (roomId: string) => api.get<Room>(`/rooms/${roomId}`),

  createRoom: (data: CreateRoomRequest) =>
    api.post<Room>("/rooms/create", data),

  getRoomByInviteCode: (inviteCode: string) =>
    api.get<Room>(`/rooms/invite/${inviteCode}`),

  invite: (roomId: string, targetUserId: string) =>
    api.post(`/rooms/${roomId}/invite/${targetUserId}`),

  forceDeleteRoom: (roomId: string) =>
    api.delete(`/rooms/admin/force/${roomId}`),
};
