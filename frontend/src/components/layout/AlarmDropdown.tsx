import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { alarmApi } from "../../api/alarmApi";
import type { Alarm } from "../../types/alarm.type";
import useAuthStore from "../../stores/authStore";

const AlarmDropdown = () => {
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchAlarms = async () => {
      try {
        const res = await alarmApi.getUnreadAlarms();
        setUnreadCount(res.data.length);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchAlarms();

    const eventSource = new EventSource(`/api/alarms/subscribe/${user.userId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      if (e.data === "connect" || e.data === "") return;
      try {
        const alarm: Alarm = JSON.parse(e.data);
        setAlarms((prev) => [alarm, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } catch {
        /* 파싱 에러 무시 */
      }
    };

    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, [isLoggedIn, user]);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open) {
      try {
        const res = await alarmApi.getAlarms();
        setAlarms(res.data);
      } catch {
        setAlarms([]);
      }
    }
  };

  const handleRead = async (alarmId: string) => {
    try {
      await alarmApi.readAlarm(alarmId);
      setAlarms((prev) =>
        prev.map((a) => (a.alarmId === alarmId ? { ...a, isRead: true } : a)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* 무시 */
    }
  };

  const handleReadAll = async () => {
    try {
      await alarmApi.readAllAlarms();
      setAlarms((prev) => prev.map((a) => ({ ...a, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* 무시 */
    }
  };

  const handleAlarmClick = async (alarm: Alarm) => {
    if (!alarm.isRead) await handleRead(alarm.alarmId);
    setOpen(false);
    if (alarm.alarmType === "COMMENT" && alarm.targetId) {
      navigate(`/board/${alarm.targetId}`);
    } else if (alarm.alarmType === "ROOM_INVITE" && alarm.targetId) {
      navigate(`/study/${alarm.targetId}`);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "방금 전";
    if (hours < 1) return `${minutes}분 전`;
    if (days < 1) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 벨 버튼 */}
      <button
        onClick={handleOpen}
        className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all relative ${
          open
            ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-black border-2 border-white px-1 shadow-lg shadow-rose-100">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 패널 */}
      {open && (
        <div className="absolute right-0 mt-4 w-[340px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between px-8 py-7 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div>
              <h3 className="text-[15px] font-black text-slate-900 tracking-tight">
                알림 센터
              </h3>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                실시간 소식
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors py-1 px-2 hover:bg-slate-50 rounded-lg"
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto scrollbar-hide divide-y divide-slate-50">
            {alarms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-[#FDFDFF]">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  새로운 알림이 없습니다
                </p>
              </div>
            ) : (
              alarms.map((alarm) => (
                <button
                  key={alarm.alarmId}
                  onClick={() => handleAlarmClick(alarm)}
                  className={`w-full flex items-start gap-5 px-8 py-6 hover:bg-slate-50 transition-all text-left relative group ${
                    !alarm.isRead ? "bg-rose-50/10" : ""
                  }`}
                >
                  {/* 아이콘 대신 타입별 텍스트 라벨 적용 (더 깔끔함) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          !alarm.isRead
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {alarm.alarmType}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">
                        {formatDate(alarm.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] leading-relaxed break-words ${!alarm.isRead ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}
                    >
                      {alarm.message}
                    </p>
                  </div>

                  {/* 읽지 않음 표시 (Rose Dot) */}
                  {!alarm.isRead && (
                    <div className="shrink-0 mt-1">
                      <div className="w-2 h-2 bg-rose-500 rounded-full shadow-sm shadow-rose-200" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmDropdown;
