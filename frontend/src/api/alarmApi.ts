import api from "./axios";
import type { Alarm } from "../types/alarm.type";

export const alarmApi = {
  getAlarms: () => api.get<Alarm[]>("/alarms/list"),

  getUnreadAlarms: () => api.get<Alarm[]>("/alarms/unread"),

  getUnreadCount: () => api.get<number>("/alarms/unread-count"),

  readAlarm: (alarmId: string) => api.patch(`/alarms/${alarmId}/read`),

  readAllAlarms: () => api.patch("/alarms/read-all"),
};
