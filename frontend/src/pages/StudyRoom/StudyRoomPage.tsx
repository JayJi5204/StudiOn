import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { roomApi } from "../../api/roomApi";
import type { Room } from "../../types/room.type";
import { useWebRTC } from "../../hooks/useWebRTC";
import VideoGrid from "../../components/studyroom/VideoGrid";
import ChatPanel from "../../components/studyroom/ChatPanel";
import ControlBar from "../../components/studyroom/ControlBar";
import RoomInfoBar from "../../components/studyroom/RoomInfoBar";

const StudyRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [myJoinedAt] = useState(Date.now());

  // WebRTC 커스텀 훅 사용
  const {
    localStream,
    participants,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(roomId, user);

  useEffect(() => {
    if (!roomId) return;
    const fetchRoom = async () => {
      try {
        const res = await roomApi.getRoom(roomId);
        setRoom(res.data);
      } catch {
        navigate("/study");
      }
    };
    fetchRoom();
  }, [roomId, navigate]);

  if (!user || !roomId) return null;

  return (
    <div className="h-screen flex flex-col bg-[#0f1115] text-white overflow-hidden font-['Pretendard_Variable']">
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          <div className="flex-1 min-h-0 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <VideoGrid
              localStream={localStream}
              participants={participants}
              localUser={{ userId: user.userId, nickName: user.nickName }}
              localAudioEnabled={audioEnabled}
              localVideoEnabled={videoEnabled}
            />
          </div>
          <div className="flex justify-center">
            <ControlBar
              audioEnabled={audioEnabled}
              videoEnabled={videoEnabled}
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
              onLeave={() => navigate("/study")}
            />
          </div>
        </div>
        <div className="w-96 border-l border-white/5 bg-[#161920]/50 backdrop-blur-xl">
          <ChatPanel roomId={roomId} />
        </div>
      </div>

      {/* 분리된 하단 정보 바 */}
      <RoomInfoBar
        room={room}
        participantsCount={participants.length + 1}
        myJoinedAt={myJoinedAt}
        user={user}
      />
    </div>
  );
};

export default StudyRoomPage;
