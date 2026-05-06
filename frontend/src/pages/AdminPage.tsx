import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import UserManagement from "../components/admin/UserManagement";
import BoardManagement from "../components/admin/BoardManagement";
import RoomManagement from "../components/admin/RoomManagement";

type Tab = "users" | "boards" | "rooms";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const [tab, setTab] = useState<Tab>("users");

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "ADMIN") {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  const TABS: { label: string; value: Tab }[] = [
    { label: "사용자 관리", value: "users" },
    { label: "콘텐츠 제어", value: "boards" },
    { label: "룸 모니터링", value: "rooms" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              시스템 관리자 권한
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            관리자 콘솔
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            서비스의 사용자 활동 및 콘텐츠 현황을 통합 관리합니다.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${
                tab === t.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 탭 컴포넌트 렌더링 */}
      <div className="mt-8">
        {tab === "users" && <UserManagement />}
        {tab === "boards" && <BoardManagement />}
        {tab === "rooms" && <RoomManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
