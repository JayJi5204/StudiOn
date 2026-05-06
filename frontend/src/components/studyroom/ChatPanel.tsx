import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import useAuthStore from "../../stores/authStore";
import type { GroupChatMessage } from "../../types/groupChat.type";

interface ChatPanelProps {
  roomId: string;
}

const ChatPanel = ({ roomId }: ChatPanelProps) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const stompClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user || !roomId) return;

    const client = new Client({
      brokerURL: `ws://${window.location.host}/groupChat-service/ws/group-chat`,
      connectHeaders: {
        userId: String(user.userId),
        nickName: user.nickName,
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("✅ 그룹 채팅 연결 성공:", frame);

      client.subscribe(`/sub/group-chat/${roomId}`, (message) => {
        const receivedMsg: GroupChatMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMsg]);
      });

      client.publish({
        destination: "/pub/group-chat/enter",
        body: JSON.stringify({ roomId: roomId }),
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        if (stompClient.current.connected) {
          stompClient.current.publish({
            destination: "/pub/group-chat/leave",
            body: JSON.stringify({ roomId: roomId }),
          });
        }
        stompClient.current.deactivate();
      }
    };
  }, [roomId, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: "/pub/group-chat/message",
      body: JSON.stringify({
        roomId: roomId,
        message: inputMessage,
      }),
    });

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-[#161920]/50 backdrop-blur-xl border-l border-white/5 shadow-2xl">
      {/* 채팅 헤더 */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          <h3 className="text-lg font-black text-white tracking-tight">
            그룹 채팅
          </h3>
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <p className="text-sm text-slate-400 font-medium text-center leading-relaxed">
              채팅이 없습니다.
              <br />
              먼저 인사를 건네보세요!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = String(msg.userId) === String(user?.userId);
          return (
            <div
              key={msg.messageId}
              className={`flex flex-col ${isMine ? "items-end" : "items-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1">
                {!isMine && (
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-tighter">
                    {msg.nickName}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {msg.sendAt
                    ? new Date(msg.sendAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
                {isMine && (
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                    나
                  </span>
                )}
              </div>
              <div
                className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium shadow-xl transition-all leading-relaxed ${
                  isMine
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-800 text-slate-200 rounded-tl-none border border-white/5"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력 영역 */}
      <form
        onSubmit={handleSendMessage}
        className="p-6 bg-black/30 backdrop-blur-2xl"
      >
        <div className="relative group">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="w-full bg-slate-900/80 border border-white/5 rounded-[1.25rem] px-6 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all pr-16"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-[1rem] flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
