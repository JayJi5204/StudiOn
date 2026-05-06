import VideoItem from "./VideoItem";

interface Participant {
  userId: string;
  nickName: string;
  stream?: MediaStream;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

interface VideoGridProps {
  localStream: MediaStream | null;
  participants: Participant[];
  localUser: { userId: string; nickName: string };
  localAudioEnabled: boolean;
  localVideoEnabled: boolean;
}

const VideoGrid = ({
  localStream,
  participants,
  localUser,
  localAudioEnabled,
  localVideoEnabled,
}: VideoGridProps) => {
  const total = participants.length + 1;

  // 인원수에 따른 동적 그리드 레이아웃
  const gridClass =
    total === 1
      ? "grid-cols-1 max-w-4xl mx-auto"
      : total === 2
        ? "grid-cols-2"
        : total <= 4
          ? "grid-cols-2"
          : "grid-cols-3";

  return (
    <div
      className={`grid ${gridClass} gap-8 p-8 h-full items-center content-center transition-all duration-500`}
    >
      {/* 1. 내 화면 */}
      <VideoItem
        stream={localStream}
        nickName={localUser.nickName}
        isLocal
        audioEnabled={localAudioEnabled}
        videoEnabled={localVideoEnabled}
      />

      {/* 2. 상대방 화면들 */}
      {participants.map((p) => (
        <VideoItem
          key={p.userId}
          stream={p.stream}
          nickName={p.nickName}
          audioEnabled={p.audioEnabled}
          videoEnabled={p.videoEnabled}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
