import type { ChatMessage } from "../../types/chat.type";

// 헤더: 상단 네비게이션 및 제목
export const ChatHeader = ({ view, title, onBack, onClose, onSearch }: any) => (
  <div className="px-8 py-6 bg-white border-b border-slate-50 flex items-center justify-between sticky top-0 z-10">
    <div className="flex items-center gap-4">
      {view !== "list" && (
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
        >
          <span className="text-sm font-bold">뒤로</span>
        </button>
      )}
      <div>
        <h3 className="text-[16px] font-black text-slate-900 truncate max-w-[200px]">
          {view === "list" ? "메시지" : title}
        </h3>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {view === "list" && (
        <button
          onClick={onSearch}
          className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-400 text-[12px] font-bold"
        >
          검색
        </button>
      )}
      <button
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-rose-50 hover:text-rose-500 text-slate-300 text-[12px] font-bold"
      >
        닫기
      </button>
    </div>
  </div>
);

// 메시지 아이템: 말풍선 렌더링
export const MessageItem = ({
  msg,
  isMe,
  showDate,
}: {
  msg: ChatMessage;
  isMe: boolean;
  showDate: boolean;
}) => (
  <div className="flex flex-col">
    {showDate && (
      <div className="flex justify-center my-4">
        <span className="px-4 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase">
          {new Date(msg.sendAt).toLocaleDateString()}
        </span>
      </div>
    )}
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div
        className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`max-w-[220px] px-5 py-3.5 rounded-[1.8rem] text-[14px] font-bold shadow-sm ${
            isMe
              ? "bg-slate-700 text-white rounded-br-none"
              : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
          }`}
        >
          {msg.message}
        </div>
        <span className="text-[9px] font-black text-slate-300 mb-1 shrink-0">
          {new Date(msg.sendAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  </div>
);
