import type { ChatRoom } from "../../types/chat.type";

export const ChatRoomList = ({ rooms, onSelect, onStartSearch }: any) => {
  if (rooms.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <p className="text-[11px] font-black text-slate-300 uppercase mb-4 tracking-widest">
          대화 내역이 없습니다
        </p>
        <button
          onClick={onStartSearch}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xl active:scale-95 transition-all"
        >
          새 대화 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      {rooms.map((room: ChatRoom) => (
        <button
          key={room.roomId}
          onClick={() => onSelect(room)}
          className="w-full flex items-center gap-4 p-5 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all mb-3 border border-transparent hover:border-slate-50 group"
        >
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-3 transition-transform">
            {room.partnerNickName?.[0]}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-black text-slate-900 truncate">
              {room.partnerNickName}
            </p>
            <p className="text-xs font-bold text-slate-400 truncate tracking-tight">
              {room.lastMessage || "메시지가 없습니다."}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
