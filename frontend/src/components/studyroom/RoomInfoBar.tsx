import { useState } from "react";
import type { Room } from "../../types/room.type";
import { ParticipantTimer } from "./ParticipantTimer"; // 기존 파일에 있던 타이머 분리 가정

interface RoomInfoBarProps {
  room: Room | null;
  participantsCount: number;
  myJoinedAt: number;
  user: any;
}

const RoomInfoBar = ({
  room,
  participantsCount,
  myJoinedAt,
  user,
}: RoomInfoBarProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!room?.inviteCode) return;
    navigator.clipboard.writeText(room.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-24 bg-[#161920] border-t border-white/5 px-10 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            현재 학습 중인 방
          </span>
          <span className="text-sm font-black truncate max-w-[200px] text-slate-200">
            {room?.roomName || "연결 중..."}
          </span>
        </div>
        <div className="h-10 w-[1px] bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            초대 코드
          </span>
          <button
            onClick={handleCopy}
            className={`text-xs font-mono font-black transition-all ${copied ? "text-emerald-400 scale-105" : "text-indigo-400 hover:text-indigo-300"}`}
          >
            {copied ? "복사되었습니다!" : room?.inviteCode || "----"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            접속 멤버
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-slate-300">
              {participantsCount}명 참여 중
            </span>
          </div>
        </div>
        <div className="h-10 w-[1px] bg-white/10" />
        <ParticipantTimer joinedAt={myJoinedAt} nickName={user.nickName} isMe />
      </div>
    </div>
  );
};

export default RoomInfoBar;
