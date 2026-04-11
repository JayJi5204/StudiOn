interface Message {
  userId: string;
  nickName: string;
  message: string;
  sendAt: string;
}

export function MessageBox({ messages }: { messages: Message[] }) {
  return (
    <div className="h-48 overflow-y-auto border rounded p-2 mb-2 bg-gray-50 space-y-1">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`text-xs px-2 py-1 rounded ${
            m.userId === "system"
              ? "bg-yellow-50 text-yellow-700 text-center"
              : m.userId === "me"
                ? "bg-blue-50 text-blue-800 text-right"
                : "bg-white text-gray-700"
          }`}
        >
          {m.userId !== "system" && m.userId !== "me" && (
            <span className="font-medium">{m.nickName}: </span>
          )}
          {m.message}
        </div>
      ))}
    </div>
  );
}

export function SendBox({
  msg,
  setMsg,
  onSend,
  connected,
}: {
  msg: string;
  setMsg: (v: string) => void;
  onSend: () => void;
  connected: boolean;
}) {
  return (
    <div className="flex gap-1">
      <input
        className="border rounded px-2 py-1 flex-1 text-sm"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) onSend();
        }}
        placeholder="메시지 입력..."
        disabled={!connected}
      />
      <button
        className="border rounded px-3 py-1 text-sm hover:bg-gray-50 text-green-600 border-green-200"
        onClick={onSend}
        disabled={!connected}
      >
        전송
      </button>
    </div>
  );
}
