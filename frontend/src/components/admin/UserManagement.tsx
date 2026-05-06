import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = keyword
        ? await userApi.searchUsers(keyword)
        : await userApi.getAllUsers();

      const filtered = res.data.filter((u: any) => u.role !== "ADMIN");
      setUsers(filtered);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("정말 이 사용자를 강제 탈퇴시키겠습니까?")) return;
    try {
      await userApi.forceDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch {
      alert("강제 탈퇴 처리에 실패했습니다.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ✅ 검색바: 2px 테두리로 강력한 포인트 유지 */}
      <div className="flex items-center gap-3 mb-12">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setKeyword(searchInput)}
          placeholder="관리할 사용자의 닉네임을 입력하세요"
          className="flex-1 bg-white border-2 border-slate-900 rounded-2xl px-6 py-4 font-bold text-slate-800 transition-all outline-none focus:bg-slate-50 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        />
        <button
          onClick={() => setKeyword(searchInput)}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all active:scale-95"
        >
          검색
        </button>
        {keyword && (
          <button
            onClick={() => {
              setKeyword("");
              setSearchInput("");
            }}
            className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-sm font-black transition-all hover:bg-slate-900 hover:text-white"
          >
            초기화
          </button>
        )}
      </div>

      {/* ✅ 테이블: 외부 테두리를 제거하고 투명하게 설정 */}
      <div className="bg-transparent overflow-hidden">
        {/* 헤더 섹션: 테두리 대신 배경색(slate-50)으로 구분 */}
        <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/80 rounded-xl mb-4">
          <span className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            계정 정보
          </span>
          <span className="col-span-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            상태
          </span>
          <span className="col-span-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            가입일
          </span>
          <span className="col-span-1 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
            관리
          </span>
        </div>

        {/* 리스트 바디: 얇은 구분선만 사용 */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-24 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest">
              관리할 데이터가 존재하지 않습니다.
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.userId}
                className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors rounded-xl"
              >
                <div className="col-span-4 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-900">
                    {u.nickName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {u.email}
                  </span>
                </div>
                <div className="col-span-3 flex justify-center">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-tighter ${
                      u.isDeleted
                        ? "bg-slate-100 text-slate-400"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {u.isDeleted ? "비활성" : "활성"}
                  </span>
                </div>
                <span className="col-span-4 text-center text-xs font-semibold text-slate-500">
                  {formatDate(u.createdAt)}
                </span>
                <div className="col-span-1 flex justify-end">
                  {!u.isDeleted && (
                    <button
                      onClick={() => handleDelete(u.userId)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
