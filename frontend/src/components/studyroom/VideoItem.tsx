import { useRef, useEffect } from "react";

interface VideoItemProps {
  stream?: MediaStream | null;
  nickName: string;
  isLocal?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

const VideoItem = ({
  stream,
  nickName,
  isLocal,
  audioEnabled = true,
  videoEnabled = true,
}: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && videoEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoEnabled]);

  return (
    <div
      className={`relative bg-slate-900 rounded-[2.5rem] overflow-hidden aspect-video border-2 transition-all duration-500 ${
        videoEnabled
          ? "border-white/5 shadow-2xl"
          : "border-rose-500/30 shadow-lg shadow-rose-500/5"
      }`}
    >
      {/* 1. 비디오 화면 또는 카메라 꺼짐 대체 화면 */}
      {videoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1d23] gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-[2rem] flex items-center justify-center shadow-2xl ring-4 ring-slate-900/50">
            <span className="text-white text-3xl font-black">
              {nickName?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-rose-400 text-xs font-black tracking-widest bg-rose-400/10 px-5 py-2 rounded-full border border-rose-400/20 shadow-sm">
              카메라 꺼짐
            </span>
          </div>
        </div>
      )}

      {/* 2. 상단 상태 아이콘 (음소거 표시) */}
      <div className="absolute top-5 right-5 flex gap-2">
        {!audioEnabled && (
          <div className="bg-rose-500/90 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-xl border border-white/20 animate-in fade-in zoom-in duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 3. 하단 정보 바 */}
      <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative">
          <div
            className={`w-2.5 h-2.5 rounded-full ${audioEnabled ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "bg-slate-500"}`}
          />
          {audioEnabled && (
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}
        </div>
        <span className="text-white text-xs font-black tracking-tight">
          {nickName}
          {isLocal && (
            <span className="text-indigo-400 ml-1.5 opacity-80">(나)</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default VideoItem;
