import { useState } from "react";
import axios from "axios";

interface UserResponse {
  userId: string;
  email: string;
  nickName: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
}

type Tab = "users" | "boards" | "rooms" | "comments";

function AdminTest() {
  const [tab, setTab] = useState<Tab>("users");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [targetBoardId, setTargetBoardId] = useState("");
  const [targetCommentId, setTargetCommentId] = useState("");
  const [targetRoomId, setTargetRoomId] = useState("");

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleGetAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<UserResponse[]>("/api/users/all-users", {
        withCredentials: true,
      });
      setUsers(res.data);
      addLog(`전체 유저 조회 성공 → ${res.data.length}명`);
    } catch (e: any) {
      addLog(`전체 유저 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDeleteUser = async (userId: string) => {
    if (!window.confirm("정말 강제 탈퇴시키겠습니까?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/users/admin/force/${userId}`, {
        withCredentials: true,
      });
      addLog(`유저 강제 탈퇴 성공 → userId: ${userId}`);
      handleGetAllUsers();
    } catch (e: any) {
      addLog(`유저 강제 탈퇴 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDeleteBoard = async () => {
    if (!targetBoardId) return alert("boardId를 입력하세요");
    if (!window.confirm("정말 강제 삭제하겠습니까?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/boards/admin/force/${targetBoardId}`, {
        withCredentials: true,
      });
      addLog(`게시글 강제 삭제 성공 → boardId: ${targetBoardId}`);
      setTargetBoardId("");
    } catch (e: any) {
      addLog(
        `게시글 강제 삭제 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForceDeleteComment = async () => {
    if (!targetCommentId) return alert("commentId를 입력하세요");
    if (!window.confirm("정말 강제 삭제하겠습니까?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/comments/admin/force/${targetCommentId}`, {
        withCredentials: true,
      });
      addLog(`댓글 강제 삭제 성공 → commentId: ${targetCommentId}`);
      setTargetCommentId("");
    } catch (e: any) {
      addLog(`댓글 강제 삭제 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDeleteRoom = async () => {
    if (!targetRoomId) return alert("roomId를 입력하세요");
    if (!window.confirm("정말 강제 삭제하겠습니까?")) return;
    setLoading(true);
    try {
      await axios.delete(`/api/rooms/admin/force/${targetRoomId}`, {
        withCredentials: true,
      });
      addLog(`방 강제 삭제 성공 → roomId: ${targetRoomId}`);
      setTargetRoomId("");
    } catch (e: any) {
      addLog(`방 강제 삭제 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "users", label: "유저 관리" },
    { key: "boards", label: "게시글 관리" },
    { key: "comments", label: "댓글 관리" },
    { key: "rooms", label: "방 관리" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded">
        <span className="text-red-700 font-medium text-sm">
          🔐 관리자 페이지
        </span>
        <span className="text-red-500 text-xs">
          ADMIN 계정으로 로그인 후 사용하세요
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-red-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="space-y-3">
          <button
            onClick={handleGetAllUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            전체 유저 조회
          </button>
          {users.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.userId}
                  className="border border-gray-200 rounded p-3 text-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{u.nickName}</p>
                    <p className="text-gray-400 text-xs">
                      {u.email} · {u.role} · id: {u.userId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleForceDeleteUser(u.userId)}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                  >
                    강제 탈퇴
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "boards" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            게시글 ID를 입력하여 강제 삭제합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="boardId"
              value={targetBoardId}
              onChange={(e) => setTargetBoardId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleForceDeleteBoard}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              강제 삭제
            </button>
          </div>
        </div>
      )}

      {tab === "comments" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            댓글 ID를 입력하여 강제 삭제합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="commentId"
              value={targetCommentId}
              onChange={(e) => setTargetCommentId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleForceDeleteComment}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              강제 삭제
            </button>
          </div>
        </div>
      )}

      {tab === "rooms" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            방 ID를 입력하여 강제 삭제합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="roomId"
              value={targetRoomId}
              onChange={(e) => setTargetRoomId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleForceDeleteRoom}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              강제 삭제
            </button>
          </div>
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

export default AdminTest;
