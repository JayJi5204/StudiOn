import { useEffect, useState } from "react";

const useElapsedTime = (startTime: number) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const format = (num: number) => String(num).padStart(2, "0");
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return {
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
  };
};

export const ParticipantTimer = ({
  joinedAt,
  nickName,
  isMe,
}: {
  joinedAt: number;
  nickName: string;
  isMe?: boolean;
}) => {
  const { hours, minutes, seconds } = useElapsedTime(joinedAt);
  return (
    <div
      className={`flex flex-col items-end px-6 py-2.5 rounded-[1.5rem] border ${isMe ? "bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5" : "bg-slate-800/50 border-slate-700/50"}`}
    >
      <span
        className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isMe ? "text-indigo-400" : "text-slate-500"}`}
      >
        {isMe ? "나의 집중 시간" : nickName}
      </span>
      <div className="text-2xl font-black font-mono tracking-tighter">
        <span className="text-white">
          {hours}:{minutes}
        </span>
        <span className="text-indigo-500 ml-1">{seconds}</span>
      </div>
    </div>
  );
};
