import { useState } from "react";
import axios from "axios";

interface StudyRankingResponse {
  userId: string;
  nickName: string;
  studyMinutes: number;
  rank: number;
}

interface StudyDailyResponse {
  date: string;
  studyMinutes: number;
}

interface BoardRankingResponse {
  boardId: string;
  title: string;
  nickName: string;
  userId: string;
  count: number;
  rank: number;
}

type Tab = "studyRanking" | "studyDaily" | "boardView" | "boardLike";

function RankingTest() {
  const [tab, setTab] = useState<Tab>("studyRanking");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [studyRankingTop, setStudyRankingTop] = useState("10");
  const [studyRanking, setStudyRanking] = useState<StudyRankingResponse[]>([]);
  const [myStudyRank, setMyStudyRank] = useState<number | null>(null);

  const [studyDays, setStudyDays] = useState("30");
  const [studyDaily, setStudyDaily] = useState<StudyDailyResponse[]>([]);

  const [boardRankingTop, setBoardRankingTop] = useState("10");
  const [boardRanking, setBoardRanking] = useState<BoardRankingResponse[]>([]);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleStudyRanking = async () => {
    setLoading(true);
    try {
      const [rankRes, myRankRes] = await Promise.all([
        axios.get<StudyRankingResponse[]>("/api/users/ranking/study", {
          params: { top: Number(studyRankingTop) },
          withCredentials: true,
        }),
        axios.get<number>("/api/users/ranking/study/my", {
          withCredentials: true,
        }),
      ]);
      setStudyRanking(rankRes.data);
      setMyStudyRank(myRankRes.data);
      addLog(`공부시간 랭킹 조회 성공 → ${rankRes.data.length}명`);
    } catch (e: any) {
      addLog(
        `공부시간 랭킹 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStudyDaily = async () => {
    setLoading(true);
    try {
      const res = await axios.get<StudyDailyResponse[]>(
        "/api/users/study/daily",
        {
          params: { days: Number(studyDays) },
          withCredentials: true,
        },
      );
      setStudyDaily(res.data);
      addLog(`일별 공부시간 조회 성공 → ${res.data.length}일`);
    } catch (e: any) {
      addLog(
        `일별 공부시간 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBoardRanking = async (type: "view" | "like") => {
    setLoading(true);
    try {
      const res = await axios.get<BoardRankingResponse[]>(
        `/api/boards/ranking/${type}`,
        {
          params: { top: Number(boardRankingTop) },
          withCredentials: true,
        },
      );
      setBoardRanking(res.data);
      addLog(
        `게시글 ${type === "view" ? "조회수" : "좋아요"} 랭킹 조회 성공 → ${res.data.length}개`,
      );
    } catch (e: any) {
      addLog(
        `게시글 랭킹 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}위`;
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "studyRanking", label: "공부시간 랭킹" },
    { key: "studyDaily", label: "공부 잔디" },
    { key: "boardView", label: "조회수 랭킹" },
    { key: "boardLike", label: "좋아요 랭킹" },
  ];

  // 잔디 색상
  const getGrassColor = (minutes: number) => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 30) return "bg-green-200";
    if (minutes < 60) return "bg-green-300";
    if (minutes < 120) return "bg-green-400";
    return "bg-green-600";
  };

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

      {/* 공부시간 랭킹 */}
      {tab === "studyRanking" && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="top"
              value={studyRankingTop}
              onChange={(e) => setStudyRankingTop(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
            />
            <button
              onClick={handleStudyRanking}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
            {myStudyRank && (
              <span className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
                내 순위: {myStudyRank}위
              </span>
            )}
          </div>
          {studyRanking.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {studyRanking.map((r) => (
                <div
                  key={r.userId}
                  className="border border-gray-200 rounded p-3 text-sm flex items-center gap-3"
                >
                  <span className="text-lg font-bold w-8">
                    {getRankEmoji(r.rank)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{r.nickName}</p>
                    <p className="text-gray-400 text-xs">id: {r.userId}</p>
                  </div>
                  <span className="text-blue-600 font-medium">
                    {r.studyMinutes >= 60
                      ? `${Math.floor(r.studyMinutes / 60)}시간 ${r.studyMinutes % 60}분`
                      : `${r.studyMinutes}분`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 공부 잔디 */}
      {tab === "studyDaily" && (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="조회 기간 (일)"
              value={studyDays}
              onChange={(e) => setStudyDays(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-32"
            />
            <button
              onClick={handleStudyDaily}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {studyDaily.length > 0 && (
            <div className="space-y-3">
              {/* 잔디 */}
              <div className="flex flex-wrap gap-1">
                {[...studyDaily].reverse().map((d) => (
                  <div
                    key={d.date}
                    className={`w-6 h-6 rounded-sm ${getGrassColor(d.studyMinutes)} cursor-pointer`}
                    title={`${d.date}: ${d.studyMinutes}분`}
                  />
                ))}
              </div>
              {/* 범례 */}
              <div className="flex gap-2 items-center text-xs text-gray-500">
                <span>적음</span>
                <div className="w-4 h-4 rounded-sm bg-gray-100" />
                <div className="w-4 h-4 rounded-sm bg-green-200" />
                <div className="w-4 h-4 rounded-sm bg-green-300" />
                <div className="w-4 h-4 rounded-sm bg-green-400" />
                <div className="w-4 h-4 rounded-sm bg-green-600" />
                <span>많음</span>
              </div>
              {/* 상세 목록 */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {studyDaily
                  .filter((d) => d.studyMinutes > 0)
                  .map((d) => (
                    <div
                      key={d.date}
                      className="flex justify-between text-xs text-gray-600 border-b border-gray-100 py-1"
                    >
                      <span>{d.date}</span>
                      <span className="text-green-600 font-medium">
                        {d.studyMinutes >= 60
                          ? `${Math.floor(d.studyMinutes / 60)}시간 ${d.studyMinutes % 60}분`
                          : `${d.studyMinutes}분`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 조회수 랭킹 */}
      {tab === "boardView" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="top"
              value={boardRankingTop}
              onChange={(e) => setBoardRankingTop(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
            />
            <button
              onClick={() => handleBoardRanking("view")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {boardRanking.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {boardRanking.map((r) => (
                <div
                  key={r.boardId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold w-8">
                      {getRankEmoji(r.rank)}
                    </span>
                    <p className="font-medium flex-1">{r.title}</p>
                    <span className="text-blue-600 font-medium">
                      👁️ {r.count}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 ml-10">
                    {r.nickName} · id: {r.boardId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 좋아요 랭킹 */}
      {tab === "boardLike" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="top"
              value={boardRankingTop}
              onChange={(e) => setBoardRankingTop(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
            />
            <button
              onClick={() => handleBoardRanking("like")}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {boardRanking.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {boardRanking.map((r) => (
                <div
                  key={r.boardId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold w-8">
                      {getRankEmoji(r.rank)}
                    </span>
                    <p className="font-medium flex-1">{r.title}</p>
                    <span className="text-red-500 font-medium">
                      ❤️ {r.count}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 ml-10">
                    {r.nickName} · id: {r.boardId}
                  </p>
                </div>
              ))}
            </div>
          )}
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

export default RankingTest;
