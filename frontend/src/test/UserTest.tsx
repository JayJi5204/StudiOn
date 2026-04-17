import { useState } from "react";
import axios from "axios";

interface LoginResponse {
  userId: string;
  email: string;
  nickName: string;
  role: string;
  isLoggedIn: boolean;
}

interface CreateResponse {
  userId: string;
  email: string;
  nickName: string;
  role: string;
}

interface GetMyInfoResponse {
  userId: string;
  email: string;
  nickName: string;
  role: string;
}

interface GetUserResponse {
  userId: string;
  email: string;
  nickName: string;
  role: string;
}

interface UpdateResponse {
  userId: string;
  email: string;
  nickName: string;
}

type Tab =
  | "login"
  | "register"
  | "allUsers"
  | "myInfo"
  | "getUser"
  | "update"
  | "delete"
  | "reissue";

function UserTest() {
  const [tab, setTab] = useState<Tab>("register");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 로그인 상태
  const [loginInfo, setLoginInfo] = useState<LoginResponse | null>(null);

  // 회원가입
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNickName, setRegNickName] = useState("");
  const [regPhone, setRegPhone] = useState("");

  // 로그인
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 전체 사용자 조회
  const [allUsers, setAllUsers] = useState<CreateResponse[]>([]);

  // 내 정보
  const [myInfo, setMyInfo] = useState<GetMyInfoResponse | null>(null);

  // 특정 사용자
  const [targetUserId, setTargetUserId] = useState("");
  const [targetUser, setTargetUser] = useState<GetUserResponse | null>(null);

  // 수정
  const [updateNickName, setUpdateNickName] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // ── 핸들러 ──────────────────────────────────────────

  const handleRegister = async () => {
    if (!regEmail || !regPassword || !regNickName || !regPhone)
      return alert("모든 항목을 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<CreateResponse>(
        "/api/users/create",
        {
          email: regEmail,
          password: regPassword,
          nickName: regNickName,
          phoneNumber: regPhone,
        },
        { withCredentials: true },
      );
      addLog(`회원가입 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`회원가입 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return alert("이메일과 비밀번호를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<LoginResponse>(
        "/api/users/login",
        { email, password },
        { withCredentials: true },
      );
      setLoginInfo(res.data);
      addLog(`로그인 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`로그인 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      setLoginInfo(null);
      addLog("로그아웃 성공");
    } catch (e: any) {
      addLog(`로그아웃 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<CreateResponse[]>("/api/users/all-users", {
        withCredentials: true,
      });
      setAllUsers(res.data);
      addLog(`전체 사용자 조회 성공 → ${res.data.length}명`);
    } catch (e: any) {
      addLog(
        `전체 사용자 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMyInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get<GetMyInfoResponse>("/api/users/my-info", {
        withCredentials: true,
      });
      setMyInfo(res.data);
      addLog(`내 정보 조회 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`내 정보 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUser = async () => {
    if (!targetUserId) return alert("userId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetUserResponse>(
        `/api/users/${targetUserId}`,
        { withCredentials: true },
      );
      setTargetUser(res.data);
      addLog(`사용자 조회 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`사용자 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateNickName && !updatePassword)
      return alert("수정할 항목을 입력하세요");
    setLoading(true);
    try {
      const res = await axios.put<UpdateResponse>(
        "/api/users/update",
        {
          nickName: updateNickName || undefined,
          password: updatePassword || undefined,
        },
        { withCredentials: true },
      );
      addLog(`회원 정보 수정 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`회원 정보 수정 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await axios.delete("/api/users/delete", {
        withCredentials: true,
      });
      setLoginInfo(null);
      addLog(`회원 탈퇴 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`회원 탈퇴 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReissue = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/reissue", {}, { withCredentials: true });
      addLog("토큰 재발급 성공");
    } catch (e: any) {
      addLog(`토큰 재발급 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── 탭 정의 ─────────────────────────────────────────

  const tabs: { key: Tab; label: string }[] = [
    { key: "register", label: "회원가입" },
    { key: "login", label: "로그인" },
    { key: "allUsers", label: "전체 조회" },
    { key: "myInfo", label: "내 정보" },
    { key: "getUser", label: "사용자 조회" },
    { key: "update", label: "정보 수정" },
    { key: "delete", label: "회원 탈퇴" },
    { key: "reissue", label: "토큰 재발급" },
  ];

  return (
    <div className="space-y-5">
      {/* 로그인 상태 배너 */}
      {loginInfo && (
        <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <span className="text-green-700">
            로그인됨: <strong>{loginInfo.nickName}</strong> ({loginInfo.email})
            · {loginInfo.role}
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="ml-auto px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
          >
            로그아웃
          </button>
        </div>
      )}

      {/* 탭 버튼 */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
              ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 회원가입 */}
      {tab === "register" && (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={regNickName}
            onChange={(e) => setRegNickName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="tel"
            placeholder="휴대폰 번호 (예: 01012345678)"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            회원가입
          </button>
        </div>
      )}

      {/* 로그인 */}
      {tab === "login" && (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            로그인
          </button>
        </div>
      )}

      {/* 전체 사용자 조회 */}
      {tab === "allUsers" && (
        <div className="space-y-3">
          <button
            onClick={handleAllUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            전체 사용자 조회
          </button>
          {allUsers.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allUsers.map((u) => (
                <div
                  key={u.userId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <p className="font-medium">{u.nickName}</p>
                  <p className="text-gray-500 text-xs">
                    {u.email} · {u.role} · id: {u.userId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 내 정보 */}
      {tab === "myInfo" && (
        <div className="space-y-3">
          <button
            onClick={handleMyInfo}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            내 정보 조회
          </button>
          {myInfo && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-1">
              <p>
                <span className="text-gray-500">닉네임:</span> {myInfo.nickName}
              </p>
              <p>
                <span className="text-gray-500">이메일:</span> {myInfo.email}
              </p>
              <p>
                <span className="text-gray-500">역할:</span> {myInfo.role}
              </p>
              <p>
                <span className="text-gray-500">ID:</span> {myInfo.userId}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 특정 사용자 조회 */}
      {tab === "getUser" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="userId"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleGetUser}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {targetUser && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-1">
              <p>
                <span className="text-gray-500">닉네임:</span>{" "}
                {targetUser.nickName}
              </p>
              <p>
                <span className="text-gray-500">이메일:</span>{" "}
                {targetUser.email}
              </p>
              <p>
                <span className="text-gray-500">역할:</span> {targetUser.role}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 정보 수정 */}
      {tab === "update" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="새 닉네임 (변경 안 하면 비워두세요)"
            value={updateNickName}
            onChange={(e) => setUpdateNickName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="password"
            placeholder="새 비밀번호 (변경 안 하면 비워두세요)"
            value={updatePassword}
            onChange={(e) => setUpdatePassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
          >
            정보 수정
          </button>
        </div>
      )}

      {/* 회원 탈퇴 */}
      {tab === "delete" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            현재 로그인된 계정을 탈퇴합니다. 복구할 수 없습니다.
          </p>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            회원 탈퇴
          </button>
        </div>
      )}

      {/* 토큰 재발급 */}
      {tab === "reissue" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            refreshToken 쿠키를 이용해 accessToken을 재발급합니다.
          </p>
          <button
            onClick={handleReissue}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            토큰 재발급
          </button>
        </div>
      )}

      {/* 로그 */}
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

export default UserTest;
