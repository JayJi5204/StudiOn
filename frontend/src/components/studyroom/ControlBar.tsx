interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

const ControlBar = ({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeave,
}: ControlBarProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-full px-8 py-4 flex gap-6 items-center shadow-2xl border border-white/10">
        {/* 마이크 버튼 */}
        <button
          onClick={onToggleAudio}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            audioEnabled
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-rose-500 text-white hover:bg-rose-600 animate-pulse"
          }`}
        >
          <span className="text-xl">{audioEnabled ? "🎤" : "🔇"}</span>
          <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">
            {audioEnabled ? "켜짐" : "음소거"}
          </span>
        </button>

        {/* 카메라 버튼 */}
        <button
          onClick={onToggleVideo}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            videoEnabled
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-rose-500 text-white hover:bg-rose-600"
          }`}
        >
          <span className="text-xl">{videoEnabled ? "📷" : "🚫"}</span>
          <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">
            {videoEnabled ? "켜짐" : "꺼짐"}
          </span>
        </button>

        <div className="w-[1px] h-10 bg-white/10 mx-2" />

        {/* 나가기 버튼 */}
        <button
          onClick={onLeave}
          className="w-14 h-14 bg-white/10 hover:bg-rose-500 text-white rounded-2xl flex flex-col items-center justify-center transition-all group"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">
            🚪
          </span>
          <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">
            나가기
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
