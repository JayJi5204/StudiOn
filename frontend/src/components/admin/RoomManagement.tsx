import { useEffect, useState } from "react";
import { roomApi } from "../../api/roomApi";

const RoomManagement = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomApi.getRooms(keyword);
      setRooms(res.data);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [keyword]);

  const handleDelete = async (roomId: string) => {
    if (!confirm("해당 스터디룸을 강제로 폐쇄하시겠습니까?")) return;
    try {
      await roomApi.forceDeleteRoom(roomId);
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    } catch {
      alert("방 삭제 처리에 실패했습니다.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ✅ 추가된 검색바: UserManagement와 동일한 디자인 시스템 적용 */}
      <div className="flex items-center gap-3 mb-12">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setKeyword(searchInput)}
          placeholder="검색할 방 제목이나 개설자를 입력하세요"
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

      {/* 테이블 영역 */}
      <div className="bg-transparent overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/80 rounded-xl mb-4">
          <span className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            방 정보
          </span>
          <span className="col-span-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            참여 인원
          </span>
          <span className="col-span-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            공개 여부
          </span>
          <span className="col-span-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            개설일
          </span>
          <span className="col-span-1 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
            관리
          </span>
        </div>

        {/* 리스트 바디 */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-32 flex justify-center">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-32 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest">
              검색 결과가 없거나 개설된 방이 없습니다.
            </div>
          ) : (
            rooms.map((r) => (
              <div
                key={r.roomId}
                className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors rounded-xl"
              >
                <div className="col-span-5 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-900 truncate pr-8">
                    {r.roomName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ID: {r.roomId.split("-")[0]}...
                  </span>
                </div>
                <span className="col-span-2 text-center text-xs font-semibold text-slate-600">
                  {r.currentPeople} / {r.maxPeople}
                </span>
                <div className="col-span-2 flex justify-center">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-tighter ${
                      r.isPrivate
                        ? "bg-slate-100 text-slate-500"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {r.isPrivate ? "비공개" : "공개"}
                  </span>
                </div>
                <span className="col-span-2 text-center text-xs font-semibold text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(r.roomId)}
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
