import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roomApi } from "../api/roomApi";
import { boardApi } from "../api/boardApi";
import { userApi } from "../api/userApi";
import type { RoomList } from "../types/room.type";
import type { BoardRanking } from "../types/board.type";
import type { StudyRanking } from "../types/user.type";
import useAuthStore from "../stores/authStore";

const MainPage = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomList[]>([]);
  const [boardRanking, setBoardRanking] = useState<BoardRanking[]>([]);
  const [studyRanking, setStudyRanking] = useState<StudyRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, boardRes, studyRes] = await Promise.allSettled([
          roomApi.getRooms(),
          boardApi.getViewRanking(),
          userApi.getStudyRanking(),
        ]);

        if (roomRes.status === "fulfilled") {
          setRooms(roomRes.value.data.slice(0, 4));
        }
        if (boardRes.status === "fulfilled") {
          setBoardRanking(boardRes.value.data.slice(0, 3));
        }
        if (studyRes.status === "fulfilled") {
          setStudyRanking(studyRes.value.data.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartStudy = () => {
    if (isLoggedIn) {
      navigate("/study");
    } else {
      navigate("/signin");
    }
  };

  const formatStudyTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Pretendard_Variable']">
      {/* 히어로 섹션 */}
      <section className="relative bg-[#0F172A] pt-32 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[80%] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-10">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            LIVE: {rooms.length}개의 스터디룸이 운영 중입니다
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-10">
            당신의 성장을 기록하는
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
              가장 완벽한 공간.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-14 font-bold leading-relaxed opacity-80">
            StudiOn은 단순한 화상 채팅을 넘어, 동료들과 함께 몰입하고
            <br className="hidden md:block" />
            성장 데이터를 시각화하는 프리미엄 스터디 플랫폼입니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* 🔥 버튼 색상 수정: blue-600 -> slate-900 (블랙 테마 통일) */}
            <button
              onClick={handleStartStudy}
              className="px-12 py-5 bg-white text-[#0F172A] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              지금 무료로 시작하기
            </button>
            <Link
              to="/board"
              className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              커뮤니티 둘러보기
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 py-32 space-y-40">
        {/* 스터디룸 섹션 */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Real-time Focus
                </h2>
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                지금 진행 중인 스터디
              </h3>
            </div>
            <Link
              to="/study"
              className="group text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
            >
              전체 보기{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"
                />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center col-span-full">
              <p className="text-slate-400 font-bold">
                현재 운영 중인 스터디룸이 없습니다.
              </p>
              <button
                onClick={handleStartStudy}
                className="mt-4 text-slate-900 font-black text-sm underline underline-offset-4"
              >
                첫 번째 방을 만들어보세요
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {rooms.map((room) => {
                const isFull = room.currentPeople >= room.maxPeople;
                return (
                  <Link
                    key={room.roomId}
                    to={`/study/${room.roomId}`}
                    className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-500 ${
                      isFull
                        ? "border-slate-100 opacity-70 cursor-not-allowed"
                        : "border-slate-100 hover:border-slate-900 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] hover:-translate-y-2"
                    }`}
                    onClick={(e) => isFull && e.preventDefault()}
                  >
                    <div className="flex items-start justify-between mb-10">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-500 ${
                          isFull
                            ? "bg-slate-50"
                            : "bg-slate-50 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110"
                        }`}
                      >
                        {isFull ? "🔒" : "📚"}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                            room.isPrivate
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {room.isPrivate ? "비공개" : "공개"}
                        </span>
                        {isFull && (
                          <span className="text-[9px] px-3 py-1 bg-red-50 text-red-500 rounded-full font-black uppercase tracking-widest">
                            Full
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="text-lg font-black text-slate-900 mb-2 truncate group-hover:text-slate-900 transition-colors">
                        {room.roomName}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {room.isPrivate
                          ? "멤버 전용 스터디"
                          : "자율 입장 스터디"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                        <span
                          className={
                            isFull
                              ? "text-red-500"
                              : "text-slate-400 group-hover:text-slate-900"
                          }
                        >
                          Participants
                        </span>
                        <span className="text-slate-900">
                          {room.currentPeople} / {room.maxPeople}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isFull
                              ? "bg-red-400"
                              : "bg-slate-900 group-hover:bg-slate-900"
                          }`}
                          style={{
                            width: `${(room.currentPeople / room.maxPeople) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* 인기 게시글 */}
          <section className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                Trending
              </h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                지금 뜨는 이야기
              </h3>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
              {boardRanking.map((board, index) => (
                <Link
                  key={board.boardId}
                  to={`/board/${board.boardId}`}
                  className="flex items-center gap-8 px-10 py-8 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                >
                  <div className="relative flex-shrink-0">
                    <span
                      className={`text-4xl font-black italic tracking-tighter ${
                        index === 0
                          ? "text-slate-900"
                          : index === 1
                            ? "text-slate-400"
                            : "text-slate-200"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>
                  <span className="flex-1 text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                    {board.title}
                  </span>
                  <div className="flex items-center gap-4 text-[11px] font-black text-slate-300 uppercase tracking-widest">
                    조회수{" "}
                    <span className="text-slate-900">
                      {board.count.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 공부왕 랭킹 */}
          <section>
            <div className="mb-12">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                Top Learners
              </h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                누적 랭킹
              </h3>
            </div>

            <div className="space-y-6">
              {studyRanking.map((user, index) => {
                const isFirst = index === 0;
                return (
                  <div
                    key={user.userId}
                    className={`flex items-center gap-6 p-8 rounded-[2.5rem] border transition-all ${
                      isFirst
                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200"
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                        isFirst
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                          : "bg-slate-50"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black ${isFirst ? "text-yellow-400" : "text-slate-400"}`}
                        >
                          {index + 1}위
                        </span>
                        <p
                          className={`text-base font-black truncate tracking-tight ${isFirst ? "text-white" : "text-slate-900"}`}
                        >
                          {user.nickName || `학습자 ${index + 1}`}
                        </p>
                      </div>
                      <p
                        className={`text-[11px] font-black uppercase tracking-widest mt-1 ${isFirst ? "text-slate-400" : "text-slate-900"}`}
                      >
                        {formatStudyTime(user.studyTime)} 몰입 중
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
