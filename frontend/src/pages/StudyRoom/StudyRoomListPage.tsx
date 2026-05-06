import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../../api/roomApi";
import type { RoomList } from "../../types/room.type";
import useAuthStore from "../../stores/authStore";
import StudyRoomCreateModal from "../../components/studyroom/StudyRoomCreateModal";
import PasswordModal from "../../components/studyroom/PasswordModal";
import InviteCodeModal from "../../components/common/InviteCodeModal";

const StudyRoomListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [rooms, setRooms] = useState<RoomList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await roomApi.getRooms(keyword || undefined);
      setRooms(res.data);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, [keyword]);

  const handleSearch = () => {
    setKeyword(searchInput);
  };

  const handleEntry = (room: RoomList) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/signin");
      return;
    }
    if (room.isPrivate) {
      setSelectedRoomId(room.roomId);
      setIsPassModalOpen(true);
    } else {
      navigate(`/study/${room.roomId}/room`);
    }
  };

  const onPasswordConfirm = (password: string) => {
    navigate(`/study/${selectedRoomId}/room`, { state: { password } });
    setIsPassModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            라이브 스터디룸
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            현재 활발하게 진행 중인 캠스터디 세션에 참여해 보세요.
          </p>
        </div>
        {/* 헤더 섹션 내 버튼 영역 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-sm font-black transition-all hover:bg-slate-900 hover:text-white active:scale-95"
          >
            초대코드로 입장
          </button>

          <button
            onClick={() =>
              isLoggedIn ? setIsCreateModalOpen(true) : navigate("/signin")
            }
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            스터디룸 만들기
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="flex items-center gap-3 mb-12">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="스터디룸 이름으로 검색"
            /* border-transparent 대신 border-slate-900을 기본으로 설정 */
            className="w-full bg-white border-2 border-slate-900 rounded-2xl px-6 py-4 font-bold text-slate-800 transition-all outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          검색
        </button>
      </div>

      {/* 리스트 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <button
              key={room.roomId}
              onClick={() => handleEntry(room)}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-slate-900 transition-all text-left flex flex-col justify-between h-64 shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-slate-50 bg-slate-900 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                    LIVE
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-tighter ${
                      room.isPrivate
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {room.isPrivate ? "비공개" : "공개"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-1 mb-2">
                  {room.roomName}
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  실시간으로 함께 집중하며 공부해보세요.
                </p>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400">
                  <b className="text-slate-900">{room.currentPeople}</b> /{" "}
                  {room.maxPeople} 명
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-all">
                  <span className="text-slate-300 group-hover:text-white transition-colors">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-900 font-black text-lg">
            검색 결과가 없습니다.
          </p>
          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                setSearchInput("");
              }}
              className="mt-4 text-slate-600 font-bold text-sm underline underline-offset-4"
            >
              전체 목록 보기
            </button>
          )}
        </div>
      )}

      {/* 모달 */}
      <StudyRoomCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <PasswordModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onSubmit={onPasswordConfirm}
      />
      <InviteCodeModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        type="ROOM"
      />
    </div>
  );
};

export default StudyRoomListPage;
