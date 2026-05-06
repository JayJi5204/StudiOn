export interface Room {
  roomId: string;
  roomName: string;
  hostId: string;
  currentPeople: number;
  maxPeople: number;
  isPrivate: boolean;
  inviteCode: string;
  createdAt: string;
}

export interface CreateRoomRequest {
  roomName: string;
  isPrivate: boolean;
  password?: string;
}

export type SignalingMessageType =
  | "join"
  | "error"
  | "offer"
  | "answer"
  | "ice-candidate"
  | "leave"
  | "status-change"
  | "force-close";

export interface SignalingMessage {
  type: SignalingMessageType;
  roomId: string;
  userId: string;
  nickName?: string;
  data?: any;
}

export interface RoomList {
  roomId: string;
  roomName: string;
  currentPeople: number;
  maxPeople: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface Participant {
  userId: string;
  nickName: string;
  stream?: MediaStream;
  pc?: RTCPeerConnection;
  joinedAt: number;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}
