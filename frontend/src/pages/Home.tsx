import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">오늘의 공부 현황</h1>

      {/* 오늘 학습 시간 */}
      <div className="bg-blue-100 p-4 rounded-lg mb-4 shadow">
        <p className="text-xl font-semibold">오늘 학습 시간 ⏱️</p>
        <p className="text-2xl">1h 20m</p>
      </div>

      {/* TODO 달성률 */}
      <div className="bg-green-100 p-4 rounded-lg mb-4 shadow">
        <p className="text-xl font-semibold">TODO 달성률 📊</p>
        <p className="text-2xl">3/5 완료</p>
      </div>

      {/* 성취 배지 */}
      <div className="bg-yellow-100 p-4 rounded-lg mb-6 shadow">
        <p className="text-xl font-semibold">내 성취 배지</p>
        <div className="flex gap-2 mt-2">
          <span className="bg-yellow-300 px-2 py-1 rounded-full">3일 연속 출석</span>
          <span className="bg-yellow-300 px-2 py-1 rounded-full">2시간 집중 달성</span>
        </div>
      </div>

      {/* 스터디룸 바로가기 버튼 */}
      <button
        onClick={() => navigate("/study")}
        className="w-full bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition"
      >
        스터디 시작하기
      </button>
    </div>
  );
}
