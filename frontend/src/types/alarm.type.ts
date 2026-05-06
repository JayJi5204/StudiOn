export type AlarmType = "COMMENT" | "CHAT" | "ROOM_INVITE";

export interface Alarm {
  alarmId: string;
  userId: string;
  alarmType: AlarmType;
  message: string;
  targetId: string;
  isRead: boolean;
  createdAt: string;
}
