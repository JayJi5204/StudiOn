import { useState } from "react";
import axios from "axios";

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

interface EnterResponse {
  roomId: string;
  message: string;
}

interface LeaveResponse {
  roomId: string;
  message: string;
}

type Tab =
  | "create"
  | "getRoom"
  | "getRooms"
  | "enter"
  | "leave"
  | "invite"
  | "inviteCode";

function RoomTest() {
  const [tab, setTab] = useState<Tab>("create");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [createdRoom, setCreatedRoom] = useState<CreateResponse | null>(null);

  const [getRoomId, setGetRoomId] = useState("");
  const [roomDetail, setRoomDetail] = useState<CreateResponse | null>(null);

  const [rooms, setRooms] = useState<GetRoomResponse[]>([]);

  const [enterRoomId, setEnterRoomId] = useState("");
  const [enterPassword, setEnterPassword] = useState("");

  const [leaveRoomId, setLeaveRoomId] = useState("");

  const [inviteRoomId, setInviteRoomId] = useState("");
  const [inviteTargetUserId, setInviteTargetUserId] = useState("");

  const [inviteCode, setInviteCode] = useState("");

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleCreate = async () => {
    if (!roomName) return alert("방 이름을 입력하세요");
    if (isPrivate && !password)
      return alert("비공개 방은 비밀번호가 필요합니다");
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

  const handleGetRoom = async () => {
    if (!getRoomId) return alert("roomId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<CreateResponse>(`/api/rooms/${getRoomId}`, {
        withCredentials: true,
      });
      setRoomDetail(res.data);
      addLog(`방 조회 성공 → ${res.data.roomName}`);
    } catch (e: any) {
      addLog(`방 조회 실패 → ${e.response?.data?.message ?? e.message}`);
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

  const handleEnter = async () => {
    if (!enterRoomId) return alert("roomId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<EnterResponse>(
        `/api/rooms/${enterRoomId}/enter`,
        enterPassword ? { password: enterPassword } : null,
        { withCredentials: true },
      );
      addLog(`방 입장 성공 → ${res.data.message}`);
    } catch (e: any) {
      addLog(`방 입장 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!leaveRoomId) return alert("roomId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<LeaveResponse>(
        `/api/rooms/${leaveRoomId}/leave`,
        {},
        { withCredentials: true },
      );
      addLog(`방 퇴장 성공 → ${res.data.message}`);
    } catch (e: any) {
      addLog(`방 퇴장 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteRoomId || !inviteTargetUserId)
      return alert("roomId와 targetUserId를 입력하세요");
    setLoading(true);
    try {
      await axios.post(
        `/api/rooms/${inviteRoomId}/invite/${inviteTargetUserId}`,
        {},
        { withCredentials: true },
      );
      addLog(`초대 성공 → userId: ${inviteTargetUserId}`);
    } catch (e: any) {
      addLog(`초대 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterByInviteCode = async () => {
    if (!inviteCode) return alert("초대코드를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<EnterResponse>(
        `/api/rooms/invite/${inviteCode}`,
        {},
        { withCredentials: true },
      );
      addLog(`초대코드 입장 성공 → ${res.data.message}`);
    } catch (e: any) {
      addLog(`초대코드 입장 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "create", label: "방 생성" },
    { key: "getRooms", label: "전체 방 조회" },
    { key: "getRoom", label: "방 조회" },
    { key: "enter", label: "방 입장" },
    { key: "leave", label: "방 퇴장" },
    { key: "invite", label: "유저 초대" },
    { key: "inviteCode", label: "초대코드 입장" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
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
              <p>
                <span className="text-gray-500">비공개:</span>{" "}
                {createdRoom.isPrivate ? "예" : "아니오"}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "getRooms" && (
        <div className="space-y-3">
          <button
            onClick={handleGetRooms}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            전체 방 조회
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "getRoom" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="roomId"
              value={getRoomId}
              onChange={(e) => setGetRoomId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleGetRoom}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {roomDetail && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-1">
              <p>
                <span className="text-gray-500">방 이름:</span>{" "}
                {roomDetail.roomName}
              </p>
              <p>
                <span className="text-gray-500">초대코드:</span>{" "}
                {roomDetail.inviteCode}
              </p>
              <p>
                <span className="text-gray-500">인원:</span>{" "}
                {roomDetail.currentPeople}/{roomDetail.maxPeople}
              </p>
              <p>
                <span className="text-gray-500">비공개:</span>{" "}
                {roomDetail.isPrivate ? "예" : "아니오"}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "enter" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="roomId"
            value={enterRoomId}
            onChange={(e) => setEnterRoomId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="password"
            placeholder="비밀번호 (공개 방이면 비워두세요)"
            value={enterPassword}
            onChange={(e) => setEnterPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <button
            onClick={handleEnter}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            입장
          </button>
        </div>
      )}

      {tab === "leave" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="roomId"
            value={leaveRoomId}
            onChange={(e) => setLeaveRoomId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          <button
            onClick={handleLeave}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            퇴장
          </button>
        </div>
      )}

      {tab === "invite" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="roomId"
            value={inviteRoomId}
            onChange={(e) => setInviteRoomId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="text"
            placeholder="초대할 유저 ID"
            value={inviteTargetUserId}
            onChange={(e) => setInviteTargetUserId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            초대
          </button>
        </div>
      )}

      {tab === "inviteCode" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="초대코드"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          <button
            onClick={handleEnterByInviteCode}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            입장
          </button>
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

export default RoomTest;
