import { useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { MessageBox, SendBox } from "./ChatComponents";

interface Message {
  userId: string;
  nickName: string;
  message: string;
  sendAt: string;
}

const MAX_GROUP_USERS = 4;
const DEFAULT_NAMES = ["홍길동", "김철수", "이영희", "박민수"];

export default function GroupChatTest() {
  const [groupRoomId, setGroupRoomId] = useState("");
  const [groupUsers, setGroupUsers] = useState(
    [
      { id: "1", nick: "홍길동" },
      { id: "2", nick: "김철수" },
    ].map((u) => ({
      ...u,
      connected: false,
      messages: [] as Message[],
      msg: "",
    })),
  );
  const groupClients = useRef<(Client | null)[]>([null, null, null, null]);

  const updateGroupUser = (
    idx: number,
    patch: Partial<(typeof groupUsers)[0]>,
  ) => {
    setGroupUsers((prev) =>
      prev.map((u, i) => (i === idx ? { ...u, ...patch } : u)),
    );
  };

  const addGroupSystemMsg = (idx: number, text: string) => {
    setGroupUsers((prev) =>
      prev.map((u, i) =>
        i === idx
          ? {
              ...u,
              messages: [
                ...u.messages,
                {
                  userId: "system",
                  nickName: "system",
                  message: text,
                  sendAt: new Date().toISOString(),
                },
              ],
            }
          : u,
      ),
    );
  };

  const addGroupUser = () => {
    if (groupUsers.length >= MAX_GROUP_USERS) return;
    const idx = groupUsers.length;
    setGroupUsers((prev) => [
      ...prev,
      {
        id: String(idx + 1),
        nick: DEFAULT_NAMES[idx],
        connected: false,
        messages: [],
        msg: "",
      },
    ]);
  };

  const removeGroupUser = (idx: number) => {
    groupClients.current[idx]?.deactivate();
    groupClients.current.splice(idx, 1);
    groupClients.current.push(null);
    setGroupUsers((prev) => prev.filter((_, i) => i !== idx));
  };

  const groupConnect = (idx: number) => {
    const user = groupUsers[idx];
    const client = new Client({
      brokerURL: "ws://localhost:8000/groupChat-service/ws/group-chat",
      connectHeaders: { userId: user.id, nickName: user.nick },
      onConnect: () => {
        updateGroupUser(idx, { connected: true });
        addGroupSystemMsg(idx, "서버에 연결되었습니다");
      },
      onDisconnect: () => {
        updateGroupUser(idx, { connected: false });
        addGroupSystemMsg(idx, "연결이 끊어졌습니다");
      },
      onStompError: (frame) => {
        addGroupSystemMsg(idx, `오류: ${frame.headers.message}`);
      },
    });
    client.activate();
    groupClients.current[idx] = client;
  };

  const groupDisconnect = (idx: number) => {
    groupClients.current[idx]?.deactivate();
    groupClients.current[idx] = null;
    updateGroupUser(idx, { connected: false });
    addGroupSystemMsg(idx, "연결을 해제했습니다");
  };

  const groupEnter = (idx: number) => {
    if (!groupRoomId) return alert("방 ID를 입력하세요");
    const client = groupClients.current[idx];
    if (!client) return;
    const myUserId = groupUsers[idx].id;

    client.subscribe(`/sub/group-chat/${groupRoomId}`, (msg) => {
      const data: Message = JSON.parse(msg.body);
      setGroupUsers((prev) =>
        prev.map((u, i) =>
          i === idx
            ? {
                ...u,
                messages: [
                  ...u.messages,
                  {
                    ...data,
                    userId: data.userId === myUserId ? "me" : data.userId,
                  },
                ],
              }
            : u,
        ),
      );
    });
    client.publish({
      destination: "/pub/group-chat/enter",
      body: JSON.stringify({ roomId: parseInt(groupRoomId) }),
    });
    addGroupSystemMsg(idx, `채팅방 [${groupRoomId}] 에 입장했습니다`);
  };

  const groupSendMsg = (idx: number) => {
    if (!groupRoomId) return alert("채팅방에 먼저 입장하세요");
    const client = groupClients.current[idx];
    const msg = groupUsers[idx].msg;
    if (!msg.trim()) return;
    client?.publish({
      destination: "/pub/group-chat/message",
      body: JSON.stringify({ roomId: parseInt(groupRoomId), message: msg }),
    });
    updateGroupUser(idx, { msg: "" });
  };

  return (
    <div>
      <div className="flex gap-3 mb-6 items-center">
        <input
          className="border rounded px-3 py-2 w-48 text-sm"
          value={groupRoomId}
          onChange={(e) => setGroupRoomId(e.target.value)}
          placeholder="방 ID 입력 (Swagger에서 생성)"
        />
        {groupRoomId && (
          <span className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
            방 ID: {groupRoomId}
          </span>
        )}
        {groupUsers.length < MAX_GROUP_USERS && (
          <button
            className="border rounded px-4 py-2 text-sm hover:bg-gray-50 text-blue-600 border-blue-200"
            onClick={addGroupUser}
          >
            + 유저 추가 ({groupUsers.length}/{MAX_GROUP_USERS})
          </button>
        )}
      </div>
      <div
        className={`grid gap-4 ${groupUsers.length <= 2 ? "grid-cols-2" : "grid-cols-2 xl:grid-cols-4"}`}
      >
        {groupUsers.map((user, idx) => (
          <div key={idx} className="border rounded-xl p-4 relative">
            {idx >= 2 && (
              <button
                className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-600"
                onClick={() => removeGroupUser(idx)}
              >
                ✕ 제거
              </button>
            )}
            <div className="text-sm font-medium mb-3 pb-2 border-b">
              유저 {idx + 1}
            </div>
            <div className="space-y-2 mb-3">
              <label className="text-xs text-gray-500">nickName</label>
              <input
                className="border rounded px-2 py-1 w-full text-sm mt-1"
                value={user.nick}
                onChange={(e) => updateGroupUser(idx, { nick: e.target.value })}
              />
            </div>
            <div
              className={`text-xs px-2 py-1 rounded mb-2 ${user.connected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {user.connected ? "연결됨" : "연결 안됨"}
            </div>
            <div className="space-y-1 mb-2">
              {!user.connected ? (
                <button
                  className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50 text-blue-600 border-blue-200"
                  onClick={() => groupConnect(idx)}
                >
                  연결
                </button>
              ) : (
                <button
                  className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50 text-red-600 border-red-200"
                  onClick={() => groupDisconnect(idx)}
                >
                  연결 해제
                </button>
              )}
              <button
                className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => groupEnter(idx)}
                disabled={!user.connected}
              >
                채팅방 입장
              </button>
            </div>
            <MessageBox messages={user.messages} />
            <SendBox
              msg={user.msg}
              setMsg={(v: string) => updateGroupUser(idx, { msg: v })}
              onSend={() => groupSendMsg(idx)}
              connected={user.connected}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
