import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { SignalingMessage, Participant } from "../types/room.type";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = (roomId: string | undefined, user: any) => {
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const sendSignal = useCallback((msg: SignalingMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const broadcastStatus = useCallback(
    (audio: boolean, video: boolean) => {
      if (!user || !roomId) return;
      sendSignal({
        type: "status-change",
        roomId,
        userId: user.userId,
        nickName: user.nickName,
        data: { audioEnabled: audio, videoEnabled: video },
      });
    },
    [roomId, user, sendSignal],
  );

  const createPeerConnection = useCallback(
    (targetUserId: string, targetNickName: string) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      pc.onicecandidate = (e) => {
        if (e.candidate && user) {
          sendSignal({
            type: "ice-candidate",
            roomId: roomId!,
            userId: user.userId,
            nickName: user.nickName,
            data: e.candidate,
          });
        }
      };

      pc.ontrack = (e) => {
        setParticipants((prev) => {
          const existing = prev.find((p) => p.userId === targetUserId);
          if (existing) {
            return prev.map((p) =>
              p.userId === targetUserId ? { ...p, stream: e.streams[0] } : p,
            );
          }
          return [
            ...prev,
            {
              userId: targetUserId,
              nickName: targetNickName,
              stream: e.streams[0],
              joinedAt: Date.now(),
              audioEnabled: true,
              videoEnabled: true,
            },
          ];
        });
      };

      pcsRef.current.set(targetUserId, pc);
      return pc;
    },
    [roomId, sendSignal, user],
  );

  const handleSignalingMessage = useCallback(
    async (msg: SignalingMessage) => {
      // ✅ force-close는 모든 사용자가 처리해야 하므로 본인 체크 예외 처리
      if (msg.userId === user?.userId && msg.type !== "force-close") return;

      switch (msg.type) {
        case "join": {
          setParticipants((prev) =>
            prev.find((p) => p.userId === msg.userId)
              ? prev
              : [
                  ...prev,
                  {
                    userId: msg.userId,
                    nickName: msg.nickName ?? "",
                    joinedAt: Date.now(),
                    audioEnabled: true,
                    videoEnabled: true,
                  },
                ],
          );
          const pc = createPeerConnection(msg.userId, msg.nickName ?? "");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal({
            type: "offer",
            roomId: roomId!,
            userId: user!.userId,
            nickName: user!.nickName,
            data: offer,
          });
          break;
        }
        case "offer": {
          const pc = createPeerConnection(msg.userId, msg.nickName ?? "");
          await pc.setRemoteDescription(
            new RTCSessionDescription(msg.data as RTCSessionDescriptionInit),
          );
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({
            type: "answer",
            roomId: roomId!,
            userId: user!.userId,
            nickName: user!.nickName,
            data: answer,
          });
          break;
        }
        case "answer": {
          const pc = pcsRef.current.get(msg.userId);
          if (pc)
            await pc.setRemoteDescription(
              new RTCSessionDescription(msg.data as RTCSessionDescriptionInit),
            );
          break;
        }
        case "ice-candidate": {
          const pc = pcsRef.current.get(msg.userId);
          if (pc && msg.data)
            await pc.addIceCandidate(
              new RTCIceCandidate(msg.data as RTCIceCandidateInit),
            );
          break;
        }
        case "status-change": {
          const data = msg.data as {
            audioEnabled: boolean;
            videoEnabled: boolean;
          };
          setParticipants((prev) =>
            prev.map((p) => (p.userId === msg.userId ? { ...p, ...data } : p)),
          );
          break;
        }
        case "leave": {
          pcsRef.current.get(msg.userId)?.close();
          pcsRef.current.delete(msg.userId);
          setParticipants((prev) =>
            prev.filter((p) => p.userId !== msg.userId),
          );
          break;
        }
        // ✅ 강제 종료 로직 추가
        case "force-close": {
          alert("방장에 의해 방이 종료되었습니다.");
          // 모든 리소스 정리 후 이동
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          pcsRef.current.forEach((pc) => pc.close());
          wsRef.current?.close();
          navigate("/study");
          break;
        }
      }
    },
    [user, roomId, createPeerConnection, sendSignal, navigate],
  );

  useEffect(() => {
    if (!user || !roomId) return;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (err) {
        console.error("미디어 접근 실패:", err);
      }
      // 환경에 따라 ws 또는 wss 처리 필요
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(
        `${protocol}://${window.location.host}/ws/signal/`,
      );
      wsRef.current = ws;
      ws.onopen = () =>
        sendSignal({
          type: "join",
          roomId,
          userId: user.userId,
          nickName: user.nickName,
        });
      ws.onmessage = (e) => handleSignalingMessage(JSON.parse(e.data));
    };
    init();
    return () => {
      if (user)
        sendSignal({
          type: "leave",
          roomId,
          userId: user.userId,
          nickName: user.nickName,
        });
      wsRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcsRef.current.forEach((pc) => pc.close());
    };
  }, [user, roomId, handleSignalingMessage, sendSignal]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const nextStatus = !audioEnabled;
      localStreamRef.current
        .getAudioTracks()
        .forEach((t) => (t.enabled = nextStatus));
      setAudioEnabled(nextStatus);
      broadcastStatus(nextStatus, videoEnabled);
    }
  }, [audioEnabled, videoEnabled, broadcastStatus]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const nextStatus = !videoEnabled;
      localStreamRef.current
        .getVideoTracks()
        .forEach((t) => (t.enabled = nextStatus));
      setVideoEnabled(nextStatus);
      broadcastStatus(audioEnabled, nextStatus);
    }
  }, [audioEnabled, videoEnabled, broadcastStatus]);

  return {
    localStream,
    participants,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  };
};
