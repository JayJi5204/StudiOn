import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import type { StudyRanking } from "../types/user.type";

const RankingPage = () => {
  const [rankings, setRankings] = useState<StudyRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await userApi.getStudyRanking();
        setRankings(res.data || []);
      } catch (error) {
        console.error("랭킹 로딩 실패:", error);
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  const formatStudyTime = (totalSeconds: number | undefined | null) => {
    const total = totalSeconds ?? 0;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    return (
      <div className="font-mono font-black flex items-baseline justify-end gap-1 text-slate-900 group-[.bg-slate-900]:text-white">
        {h > 0 && (
          <>
            <span className="text-xl md:text-2xl">{h.toLocaleString()}</span>
            <span className="text-[10px] md:text-xs opacity-40 mr-1">H</span>
          </>
        )}
        {(h > 0 || m > 0) && (
          <>
            <span className="text-xl md:text-2xl">{m.toLocaleString()}</span>
            <span className="text-[10px] md:text-xs opacity-40 mr-1">M</span>
          </>
        )}
        <span className="text-xl md:text-2xl text-blue-600 group-[.bg-slate-900]:text-blue-400">
          {s.toLocaleString()}
        </span>
        <span className="text-[10px] md:text-xs opacity-40">S</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-20 animate-pulse">
        <div className="h-12 w-48 bg-slate-100 rounded-xl mb-12" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-50 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-20 font-['Pretendard_Variable']">
      <div className="mb-16 text-center md:text-left">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
          랭킹
        </h1>
        <p className="text-slate-400 font-bold text-sm">
          여러분의 뜨거운 몰입의 순간들입니다.
        </p>
      </div>

      {rankings.length === 0 ? (
        <div className="bg-slate-50 rounded-[3.5rem] py-32 border border-dashed border-slate-200 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl mb-6">
            🏆
          </div>
          <p className="text-slate-900 font-black text-xl mb-2">
            아직 랭킹 데이터가 없어요
          </p>
          <p className="text-slate-400 font-bold text-sm">
            지금 바로 공부를 시작하고 첫 번째 기록을 남겨보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((user, index) => (
            <div
              key={user.userId || index}
              className={`group flex items-center gap-4 md:gap-8 p-6 md:p-8 rounded-[2.5rem] border transition-all ${
                index === 0
                  ? "bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200 text-white"
                  : "bg-white border-slate-100 hover:border-slate-900 shadow-sm"
              }`}
            >
              {/* 순위 */}
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-xl font-black shrink-0 ${
                  index === 0
                    ? "bg-white text-slate-900 shadow-lg"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {index + 1}
              </div>

              {/* 유저 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-lg md:text-xl truncate">
                    {user.nickName || "알 수 없는 사용자"}
                  </h3>
                  {index === 0 && <span className="text-xs">👑</span>}
                </div>
                <p
                  className={`text-[11px] md:text-xs font-bold truncate ${index === 0 ? "text-slate-400" : "text-slate-300"}`}
                >
                  {/* StudyRanking 인터페이스에 email이 없을 경우를 대비해 처리 */}
                  {(user as any).email || "Focus Member"}
                </p>
              </div>

              {/* 시간 표시 */}
              <div className="text-right shrink-0">
                <span
                  className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest block mb-1 ${index === 0 ? "text-slate-500" : "text-slate-300"}`}
                >
                  Focus Duration
                </span>
                {/* StudyRanking의 시간 필드명(studyTime)에 맞춰 호출 */}
                {formatStudyTime(user.studyTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankingPage;
