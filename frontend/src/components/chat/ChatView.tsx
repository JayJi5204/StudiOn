import { useRef, useEffect } from "react";
import { MessageItem } from "./ChatParts";

export const ChatView = ({
  messages,
  userId,
  input,
  setInput,
  onSend,
  loading,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide bg-[#FDFDFF]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-300 text-xs font-black uppercase tracking-widest">
            로딩 중...
          </div>
        ) : (
          messages.map((msg: any, idx: number) => (
            <MessageItem
              key={msg.messageId}
              msg={msg}
              isMe={msg.userId === userId}
              showDate={
                idx === 0 ||
                new Date(messages[idx - 1].sendAt).toDateString() !==
                  new Date(msg.sendAt).toDateString()
              }
            />
          ))
        )}
        <div ref={scrollRef} />
      </div>
      <div className="p-6 bg-white border-t border-slate-50">
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.5rem]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // ✅ 한글 입력 중(IME 구성 중)일 때는 엔터 이벤트를 무시합니다.
              if (e.nativeEvent.isComposing) return;

              if (e.key === "Enter") {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="메시지 입력..."
            className="flex-1 bg-transparent px-4 text-sm font-bold outline-none"
          />
          <button
            onClick={onSend}
            className="w-12 h-12 bg-slate-600 text-white rounded-[1.2rem] shadow-lg hover:bg-slate-700 transition-all disabled:opacity-30"
            disabled={!input.trim()}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};
