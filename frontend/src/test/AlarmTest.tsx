import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface AlarmResponse {
  alarmId: string;
  userId: string;
  alarmType: string;
  message: string;
  targetId: string;
  isRead: boolean;
  createdAt: string;
}

function AlarmTest() {
  const [userId, setUserId] = useState("");
  const [connected, setConnected] = useState(false);
  const [alarms, setAlarms] = useState<AlarmResponse[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const connect = () => {
    if (!userId) return alert("userId를 입력하세요");

    const eventSource = new EventSource(
      `http://localhost:8167/api/alarms/subscribe/${userId}`,
    );

    eventSource.onopen = () => {
      setConnected(true);
      addLog("SSE 연결되었습니다");
    };

    eventSource.onmessage = (event) => {
      addLog(`알림 수신: ${event.data}`);
    };

    eventSource.addEventListener("COMMENT", (event) => {
      const data = JSON.parse(event.data);
      setAlarms((prev) => [data, ...prev]);
      addLog(`댓글 알림: ${data.message}`);
    });

    eventSource.addEventListener("CHAT", (event) => {
      const data = JSON.parse(event.data);
      setAlarms((prev) => [data, ...prev]);
      addLog(`채팅 알림: ${data.message}`);
    });

    eventSource.addEventListener("ROOM_INVITE", (event) => {
      const data = JSON.parse(event.data);
      setAlarms((prev) => [data, ...prev]);
      addLog(`방 초대 알림: ${data.message}`);
    });

    eventSource.onerror = () => {
      setConnected(false);
      addLog("SSE 연결 오류");
    };

    eventSourceRef.current = eventSource;
  };

  const disconnect = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setConnected(false);
    addLog("SSE 연결 해제");
  };

  const fetchAlarms = async () => {
    try {
      const res = await axios.get<AlarmResponse[]>("/api/alarms/list", {
        withCredentials: true,
      });
      setAlarms(res.data);
      addLog(`전체 알림 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(`알림 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    }
  };

  const fetchUnreadAlarms = async () => {
    try {
      const res = await axios.get<AlarmResponse[]>("/api/alarms/unread", {
        withCredentials: true,
      });
      setAlarms(res.data);
      addLog(`읽지 않은 알림 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(`알림 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    }
  };

  const readAlarm = async (alarmId: string) => {
    try {
      await axios.patch(
        `/api/alarms/${alarmId}/read`,
        {},
        {
          withCredentials: true,
        },
      );
      setAlarms((prev) =>
        prev.map((a) => (a.alarmId === alarmId ? { ...a, isRead: true } : a)),
      );
      addLog(`알림 읽음 처리 성공 alarmId=${alarmId}`);
    } catch (e: any) {
      addLog(`알림 읽음 처리 실패 → ${e.response?.data?.message ?? e.message}`);
    }
  };
  const readAllAlarms = async () => {
    try {
      await axios.patch("/api/alarms/read-all", {}, { withCredentials: true });
      setAlarms((prev) => prev.map((a) => ({ ...a, isRead: true })));
      addLog("전체 알림 읽음 처리 성공");
    } catch (e: any) {
      addLog(`전체 읽음 처리 실패 → ${e.response?.data?.message ?? e.message}`);
    }
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="space-y-5">
      {/* SSE 연결 */}
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          {!connected ? (
            <button
              onClick={connect}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              SSE 구독
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              구독 해제
            </button>
          )}
          <div
            className={`text-xs px-2 py-1 rounded ${connected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {connected ? "연결됨" : "연결 안됨"}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAlarms}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            전체 알림 조회
          </button>
          <button
            onClick={fetchUnreadAlarms}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            읽지 않은 알림
          </button>
          <button
            onClick={readAllAlarms}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            전체 읽음 처리
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      {alarms.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alarms.map((a) => (
            <div
              key={a.alarmId}
              className={`border rounded p-3 text-sm flex items-center justify-between ${a.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"}`}
            >
              <div>
                <span
                  className={`text-xs px-2 py-0.5 rounded mr-2 ${
                    a.alarmType === "COMMENT"
                      ? "bg-green-100 text-green-700"
                      : a.alarmType === "CHAT"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {a.alarmType}
                </span>
                <span>{a.message}</span>
              </div>
              {!a.isRead && (
                <button
                  onClick={() => readAlarm(a.alarmId)}
                  className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                >
                  읽음
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 로그 */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1 max-h-40 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-400 text-xs">요청 로그가 여기 표시됩니다</p>
        ) : (
          log.map((l, i) => (
            <p key={i} className="text-xs text-gray-700 font-mono">
              {l}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default AlarmTest;
