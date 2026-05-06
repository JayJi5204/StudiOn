import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { userApi } from "../../api/userApi";
import { alarmApi } from "../../api/alarmApi"; // 추가
import AlarmDropdown from "../layout/AlarmDropdown";

const NAV_ITEMS = [
  { to: "/study", label: "라이브 스터디" },
  { to: "/study-group", label: "스터디 그룹" },
  { to: "/board", label: "커뮤니티" },
  { to: "/ranking", label: "랭킹" },
] as const;

const Header = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 알람 개수 상태 관리
  const profileRef = useRef<HTMLDivElement>(null);

  // 1. 알림 데이터 초기 로드 및 SSE 실시간 구독
  useEffect(() => {
    if (!isLoggedIn || !user?.userId) {
      setUnreadCount(0);
      return;
    }

    // 초기 읽지 않은 알림 개수 가져오기
    const fetchCount = async () => {
      try {
        const { data } = await alarmApi.getUnreadCount();
        setUnreadCount(data);
      } catch (err) {
        console.error("알림 개수 로드 실패:", err);
      }
    };

    fetchCount();

    // SSE 연결: Nginx 설정(/api/alarms/subscribe/)을 타도록 상대 경로 사용
    const eventSource = new EventSource(`/api/alarms/subscribe/${user.userId}`);

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isLoggedIn, user?.userId]);

  // 2. 스크롤 시 헤더 스타일 변경
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. 외부 클릭 시 프로필 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await userApi.logout();
    } catch {
      /* 에러 무시 */
    } finally {
      logout();
      setIsProfileOpen(false);
      navigate("/signin");
    }
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // 레드 닷 노출 조건
  const hasNewAlarm = unreadCount > 0;

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm"
          : "bg-white border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* 로고 영역 */}
        <div className="flex items-center gap-14">
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-[1rem] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg shadow-slate-200">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              Studi<span className="text-slate-900">On</span>
            </span>
          </Link>

          {/* 메인 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-5 py-2.5 rounded-2xl text-[14px] font-black transition-all ${
                  isActive(item.to)
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 우측 유틸리티 영역 */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* 알림 섹션: 레드 닷 적용 */}
              <div className="relative">
                {/* 
                  팁: AlarmDropdown 내부에서 알림을 읽었을 때 
                  이 unreadCount 상태도 0으로 동기화해주면 더 완벽합니다.
                */}
                <AlarmDropdown />
                {hasNewAlarm && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                )}
              </div>

              <div className="w-px h-5 bg-slate-100 mx-2 hidden md:block" />

              {/* 프로필 섹션 */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all border ${
                    isProfileOpen
                      ? "bg-slate-50 border-slate-200 shadow-inner"
                      : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-9 h-9 bg-slate-900 rounded-[0.8rem] flex items-center justify-center shadow-md shadow-slate-200">
                    <span className="text-white font-black text-sm">
                      {user?.nickName?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-[1.2]">
                    <span className="text-[13px] font-black text-slate-900">
                      {user?.nickName || "사용자"}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {user?.role === "ADMIN" ? "관리자" : "온라인"}
                    </span>
                  </div>
                </button>

                {/* 프로필 드롭다운 메뉴 */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 py-3 z-[110] animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="px-7 py-5 border-b border-slate-50">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">
                        내 계정 정보
                      </p>
                      <p className="text-sm font-black text-slate-900 truncate">
                        {user?.nickName}
                      </p>
                    </div>

                    <div className="p-3 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (user?.userId) navigate(`/profile/${user.userId}`);
                        }}
                        className="w-full flex items-center px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all text-left"
                      >
                        내 프로필
                      </button>

                      {user?.role === "ADMIN" && (
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/admin");
                          }}
                          className="w-full flex items-center px-5 py-3.5 text-sm font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left"
                        >
                          관리자 콘솔
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-5 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-left"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              className="px-8 py-3 bg-slate-900 text-white rounded-[1.2rem] hover:bg-black transition-all text-sm font-black tracking-widest uppercase shadow-xl shadow-slate-200"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
