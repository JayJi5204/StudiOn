import { useState, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import useUserInfoStore from "../store/userInfoStore";

interface Message {
  userId: string;
  nickName: string;
  message: string;
  sendAt: string;
}

interface SignalingMessage {
  type: string;
  roomId: string;
  userId: string;
  nickName?: string;
  data?: any;
}

interface CreateResponse {
  roomId: string;
  roomName: string;
  inviteCode: string;
  maxPeople: number;
  currentPeople: number;
  isPrivate: boolean;
  createdAt: string;
}

interface GetRoomResponse {
  roomId: string;
  roomName: string;
  hostId: string;
  currentPeople: number;
  maxPeople: number;
  isPrivate: boolean;
  createdAt: string;
}

interface RemoteUser {
  userId: string;
  nickName: string;
}

type Tab = "create" | "join" | "invite" | "rooms";

function StudyRoomTest() {
  const { userInfo } = useUserInfoStore();
  const userId = userInfo.userId;
  const nickName = userInfo.nickName;

  const [tab, setTab] = useState<Tab>("create");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inRoom, setInRoom] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [createdRoom, setCreatedRoom] = useState<CreateResponse | null>(null);

  const [roomId, setRoomId] = useState("");

  const [inviteCode, setInviteCode] = useState("");
  const [inviteCodeRoom, setInviteCodeRoom] = useState<GetRoomResponse | null>(
    null,
  );

  const [inviteTargetUserId, setInviteTargetUserId] = useState("");

  const [rooms, setRooms] = useState<GetRoomResponse[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");

  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const stompRef = useRef<Client | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const iceServers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  useEffect(() => {
    if (inRoom && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [inRoom]);

  useEffect(() => {
    remoteUsers.forEach((remote) => {
      const video = remoteVideoRefs.current.get(remote.userId);
      const stream = remoteStreamsRef.current.get(remote.userId);
      if (video && stream && !video.srcObject) {
        video.srcObject = stream;
      }
    });
  }, [remoteUsers]);

  const handleCreate = async () => {
    if (!roomName) return alert("방 이름을 입력하세요");
    if (isPrivate && !password)
      return alert("비공개 방은 비밀번호가 필요합니다");
    if (!userInfo.isLoggedIn) return alert("로그인이 필요합니다");
    setLoading(true);
    try {
      const res = await axios.post<CreateResponse>(
        "/api/rooms/create",
        { roomName, isPrivate, password: isPrivate ? password : null },
        { withCredentials: true },
      );
      setCreatedRoom(res.data);
      addLog(
        `방 생성 성공 → roomId: ${res.data.roomId}, 초대코드: ${res.data.inviteCode}`,
      );
    } catch (e: any) {
      addLog(`방 생성 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRoomByInviteCode = async () => {
    if (!inviteCode) return alert("초대코드를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetRoomResponse>(
        `/api/rooms/invite/${inviteCode}`,
        { withCredentials: true },
      );
      setInviteCodeRoom(res.data);
      addLog(`초대코드 조회 성공 → roomId: ${res.data.roomId}`);
    } catch (e: any) {
      addLog(`초대코드 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get<GetRoomResponse[]>("/api/rooms/list", {
        withCredentials: true,
      });
      setRooms(res.data);
      addLog(`전체 방 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(`전체 방 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendSignaling = (data: any) => {
    wsRef.current?.send(JSON.stringify(data));
  };

  const createPeerConnection = (remoteUserId: string, targetRoomId: string) => {
    const pc = new RTCPeerConnection(iceServers);
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignaling({
          type: "ice-candidate",
          roomId: targetRoomId,
          userId,
          nickName,
          data: { candidate: event.candidate, targetUserId: remoteUserId },
        });
      }
    };
    pc.ontrack = (event) => {
      addLog(`원격 스트림 수신 from=${remoteUserId}`);
      const stream = event.streams[0];
      remoteStreamsRef.current.set(remoteUserId, stream);
      const video = remoteVideoRefs.current.get(remoteUserId);
      if (video) {
        video.srcObject = stream;
      } else {
        setTimeout(() => {
          const v = remoteVideoRefs.current.get(remoteUserId);
          if (v) v.srcObject = stream;
        }, 500);
      }
    };
    peerConnectionsRef.current.set(remoteUserId, pc);
    return pc;
  };

  const enterRoom = async (targetRoomId: string) => {
    if (!userInfo.isLoggedIn) return alert("로그인이 필요합니다");
    if (!targetRoomId) return alert("roomId가 없습니다");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      addLog("카메라/마이크 접근 성공");
    } catch (e) {
      addLog("카메라/마이크 접근 실패");
      return;
    }

    const ws = new WebSocket(`ws://${window.location.host}/ws/signal/`);
    wsRef.current = ws;

    ws.onopen = () => {
      addLog("시그널링 서버 연결");
      sendSignaling({
        type: "join",
        roomId: targetRoomId,
        userId,
        nickName,
        data: null,
      });
    };

    ws.onmessage = async (event) => {
      const message: SignalingMessage = JSON.parse(event.data);
      switch (message.type) {
        case "join":
          await handleJoin(
            message.userId,
            message.nickName || message.userId,
            targetRoomId,
          );
          break;
        case "offer":
          await handleOffer(message, targetRoomId);
          break;
        case "answer":
          await handleAnswer(message);
          break;
        case "ice-candidate":
          await handleIceCandidate(message);
          break;
        case "leave":
          handleLeave(message.userId);
          break;
        case "error":
          addLog(`오류: ${message.data}`);
          break;
      }
    };

    ws.onerror = () => addLog("시그널링 오류");
    ws.onclose = () => addLog("시그널링 연결 종료");

    const stomp = new Client({
      brokerURL: `ws://${window.location.host}/ws/group-chat`,
      connectHeaders: { userId, nickName },
      onConnect: () => {
        stomp.subscribe(`/sub/group-chat/${targetRoomId}`, (msg) => {
          const data: Message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
        stomp.publish({
          destination: "/pub/group-chat/enter",
          body: JSON.stringify({ roomId: targetRoomId }),
        });
        addLog("채팅 서버 연결");
      },
    });
    stomp.activate();
    stompRef.current = stomp;

    setRoomId(targetRoomId);
    setInRoom(true);
  };

  const handleJoin = async (
    remoteUserId: string,
    remoteNickName: string,
    targetRoomId: string,
  ) => {
    addLog(`참여자 입장 ${remoteNickName}(${remoteUserId})`);
    setRemoteUsers((prev) => [
      ...prev,
      { userId: remoteUserId, nickName: remoteNickName },
    ]);
    const pc = createPeerConnection(remoteUserId, targetRoomId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignaling({
      type: "offer",
      roomId: targetRoomId,
      userId,
      nickName,
      data: { offer, targetUserId: remoteUserId },
    });
  };

  const handleOffer = async (
    message: SignalingMessage,
    targetRoomId: string,
  ) => {
    const remoteUserId = message.userId;
    const remoteNickName = message.nickName || remoteUserId;
    setRemoteUsers((prev) =>
      prev.find((u) => u.userId === remoteUserId)
        ? prev
        : [...prev, { userId: remoteUserId, nickName: remoteNickName }],
    );
    const pc = createPeerConnection(remoteUserId, targetRoomId);
    await pc.setRemoteDescription(
      new RTCSessionDescription(message.data.offer),
    );
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignaling({
      type: "answer",
      roomId: targetRoomId,
      userId,
      nickName,
      data: { answer, targetUserId: remoteUserId },
    });
  };

  const handleAnswer = async (message: SignalingMessage) => {
    const pc = peerConnectionsRef.current.get(message.userId);
    if (pc)
      await pc.setRemoteDescription(
        new RTCSessionDescription(message.data.answer),
      );
  };

  const handleIceCandidate = async (message: SignalingMessage) => {
    const pc = peerConnectionsRef.current.get(message.userId);
    if (pc && message.data.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(message.data.candidate));
    }
  };

  const handleLeave = (remoteUserId: string) => {
    addLog(`참여자 퇴장 userId=${remoteUserId}`);
    setRemoteUsers((prev) => prev.filter((u) => u.userId !== remoteUserId));
    peerConnectionsRef.current.get(remoteUserId)?.close();
    peerConnectionsRef.current.delete(remoteUserId);
    remoteStreamsRef.current.delete(remoteUserId);
    remoteVideoRefs.current.delete(remoteUserId);
  };

  const leaveRoom = () => {
    sendSignaling({ type: "leave", roomId, userId, nickName, data: null });
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    wsRef.current?.close();
    stompRef.current?.deactivate();
    remoteStreamsRef.current.clear();
    remoteVideoRefs.current.clear();
    setRemoteUsers([]);
    setInRoom(false);
    setMessages([]);
    setRoomId("");
    addLog("방 나가기");
  };

  const toggleCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const sendMsg = () => {
    if (!msg.trim() || !stompRef.current) return;
    stompRef.current.publish({
      destination: "/pub/group-chat/message",
      body: JSON.stringify({ roomId: roomId, message: msg }),
    });
    setMsg("");
  };

  const handleInvite = async () => {
    if (!inviteTargetUserId) return alert("초대할 유저 ID를 입력하세요");
    try {
      await axios.post(
        `/api/rooms/${roomId}/invite/${inviteTargetUserId}`,
        {},
        { withCredentials: true },
      );
      addLog(`초대 성공 → userId: ${inviteTargetUserId}`);
      setInviteTargetUserId("");
    } catch (e: any) {
      addLog(`초대 실패 → ${e.response?.data?.message ?? e.message}`);
    }
  };

  const totalUsers = remoteUsers.length + 1;
  const gridCols = totalUsers <= 1 ? "grid-cols-1" : "grid-cols-2";

  useEffect(() => {
    return () => {
      if (inRoom) leaveRoom();
    };
  }, []);

  if (inRoom) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
          <span className="text-green-700 text-sm font-medium">
            🟢 {nickName} · 방 {roomId} · 참여자 {totalUsers}명
          </span>
          <div className="ml-auto flex gap-2 items-center">
            <button
              onClick={toggleCamera}
              className={`px-3 py-1.5 rounded text-sm ${cameraOn ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {cameraOn ? "📷 ON" : "📷 OFF"}
            </button>
            <button
              onClick={toggleMic}
              className={`px-3 py-1.5 rounded text-sm ${micOn ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {micOn ? "🎤 ON" : "🎤 OFF"}
            </button>
            {/* 초대 */}
            <input
              type="text"
              placeholder="초대할 유저 ID"
              value={inviteTargetUserId}
              onChange={(e) => setInviteTargetUserId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-xs w-40"
            />
            <button
              onClick={handleInvite}
              className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              초대
            </button>
            <button
              onClick={leaveRoom}
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              나가기
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className={`grid ${gridCols} gap-2`}>
              <div className="relative bg-gray-900 rounded-lg aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full rounded-lg object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  나 ({nickName})
                </div>
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                    <span className="text-white text-2xl">📷</span>
                  </div>
                )}
              </div>
              {remoteUsers.map((remote) => (
                <div
                  key={remote.userId}
                  className="relative bg-gray-900 rounded-lg aspect-video"
                >
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current.set(remote.userId, el);
                        const stream = remoteStreamsRef.current.get(
                          remote.userId,
                        );
                        if (stream && !el.srcObject) {
                          // srcObject가 없을 때만 설정
                          el.srcObject = stream;
                        }
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {remote.nickName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-64 flex flex-col border border-gray-200 rounded-lg">
            <div className="p-2 border-b border-gray-200 text-sm font-medium text-gray-700">
              💬 채팅
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-80">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-xs text-center">
                  메시지가 없습니다
                </p>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded p-2 ${
                      m.userId === userId
                        ? "bg-blue-50 text-blue-800 ml-4"
                        : "bg-gray-50 text-gray-700 mr-4"
                    }`}
                  >
                    {m.userId !== userId && (
                      <p className="font-medium text-gray-500 mb-0.5">
                        {m.nickName}
                      </p>
                    )}
                    <p>{m.message}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-gray-200 flex gap-1">
              <input
                type="text"
                placeholder="메시지 입력..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing)
                    sendMsg();
                }}
                className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
              />
              <button
                onClick={sendMsg}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                전송
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1 max-h-32 overflow-y-auto">
          {log.map((l, i) => (
            <p key={i} className="text-xs text-gray-700 font-mono">
              {l}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!userInfo.isLoggedIn && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          ⚠️ 로그인이 필요합니다
        </div>
      )}
      {userInfo.isLoggedIn && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <span className="font-medium">{nickName}</span> ({userId}) 로
          입장합니다
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {(
          [
            { key: "create", label: "방 생성" },
            { key: "join", label: "방 입장" },
            { key: "invite", label: "초대코드 입장" },
            { key: "rooms", label: "전체 방 조회" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "create" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="방 이름"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            비공개 방
          </label>
          {isPrivate && (
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
            />
          )}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            방 생성
          </button>
          {createdRoom && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-1">
              <p>
                <span className="text-gray-500">방 이름:</span>{" "}
                {createdRoom.roomName}
              </p>
              <p>
                <span className="text-gray-500">roomId:</span>{" "}
                {createdRoom.roomId}
              </p>
              <p>
                <span className="text-gray-500">초대코드:</span>{" "}
                <span className="font-medium text-blue-600">
                  {createdRoom.inviteCode}
                </span>
              </p>
              <p>
                <span className="text-gray-500">인원:</span>{" "}
                {createdRoom.currentPeople}/{createdRoom.maxPeople}
              </p>
              <button
                onClick={() => enterRoom(createdRoom.roomId)}
                className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                바로 입장
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "join" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            roomId를 입력하여 방에 입장합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={() => enterRoom(roomId)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              입장
            </button>
          </div>
        </div>
      )}

      {tab === "invite" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            초대코드로 방 정보를 조회하고 입장합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="초대코드"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleGetRoomByInviteCode}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {inviteCodeRoom && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-1">
              <p>
                <span className="text-gray-500">방 이름:</span>{" "}
                {inviteCodeRoom.roomName}
              </p>
              <p>
                <span className="text-gray-500">roomId:</span>{" "}
                {inviteCodeRoom.roomId}
              </p>
              <p>
                <span className="text-gray-500">인원:</span>{" "}
                {inviteCodeRoom.currentPeople}/{inviteCodeRoom.maxPeople}
              </p>
              <button
                onClick={() => enterRoom(inviteCodeRoom.roomId)}
                className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                입장
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "rooms" && (
        <div className="space-y-3">
          <button
            onClick={handleGetRooms}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            조회
          </button>
          {rooms.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rooms.map((r) => (
                <div
                  key={r.roomId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.roomName}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${r.isPrivate ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                    >
                      {r.isPrivate ? "비공개" : "공개"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    인원: {r.currentPeople}/{r.maxPeople} · id: {r.roomId}
                  </p>
                  <button
                    onClick={() => enterRoom(r.roomId)}
                    className="mt-2 w-full px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    입장
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1 max-h-40 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-400 text-xs">요청 로그가 여기 표시됩니다</p>
        ) : (
          log.map((l, i) => (
            <p key={i} className="text-xs text-gray-700 font-mono">
              {l}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default StudyRoomTest;
