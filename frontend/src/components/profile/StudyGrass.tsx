import { useEffect, useState, useMemo } from "react";
import { userApi } from "../../api/userApi";
import type { StudyDaily } from "../../types/user.type";

const StudyGrass = () => {
  const [dailyData, setDailyData] = useState<StudyDaily[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await userApi.getStudyDaily(52 * 7);
        // 데이터가 null이거나 undefined일 경우를 대비해 빈 배열로 초기화
        setDailyData(res?.data || []);
      } catch (error) {
        console.error("활동 데이터 로딩 실패:", error);
        setDailyData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, []);

  // 밀도에 따른 색상 체계
  const getColor = (minutes: number) => {
    // minutes가 null이거나 NaN일 경우 0으로 처리
    const mins = isNaN(minutes) || !minutes ? 0 : minutes;
    if (mins === 0) return "bg-slate-100";
    if (mins < 30) return "bg-blue-100";
    if (mins < 60) return "bg-blue-200";
    if (mins < 120) return "bg-blue-400";
    if (mins < 180) return "bg-blue-600";
    return "bg-blue-800";
  };

  const getTooltip = (date: string, minutes: number) => {
    const minsValue = isNaN(minutes) || !minutes ? 0 : minutes;
    if (minsValue === 0) return `${date}: 학습 기록 없음`;
    const hours = Math.floor(minsValue / 60);
    const mins = minsValue % 60;
    const timeStr = hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    return `${date}: ${timeStr} 집중함`;
  };

  // 그리드 데이터 생성 로직을 useMemo로 최적화 및 NaN 방지
  const columns = useMemo(() => {
    const days: { date: string; minutes: number }[] = [];
    const dataMap = new Map();

    // API 데이터를 Map에 담을 때 숫자인지 확실히 검증
    dailyData.forEach((d) => {
      if (d.date) {
        dataMap.set(d.date, Number(d.studyTime) || 0);
      }
    });

    const today = new Date();
    // 타임존 영향을 피하기 위해 시간을 00:00:00으로 고정
    today.setHours(0, 0, 0, 0);

    for (let i = 52 * 7 - 1; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);

      // YYYY-MM-DD 포맷을 수동으로 생성 (ISOString 타임존 버그 방지)
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      days.push({
        date: dateStr,
        minutes: dataMap.get(dateStr) ?? 0,
      });
    }

    const cols: { date: string; minutes: number }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }
    return cols;
  }, [dailyData]);

  // 총 학습 시간 계산 (NaN 방지)
  const totalStudyTime = useMemo(() => {
    return dailyData.reduce((acc, curr) => {
      const time = Number(curr.studyTime);
      return acc + (isNaN(time) ? 0 : time);
    }, 0);
  }, [dailyData]);

  const MONTHS = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const DAYS = ["", "월", "", "수", "", "금", ""];

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse mb-8" />
        <div className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Activity Tracking
          </h3>
          <h4 className="text-xl font-black text-slate-900 tracking-tight">
            나의 학습 잔디
          </h4>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            지난 1년간의 몰입
          </span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max pb-2">
          {/* 요일 라벨 */}
          <div className="flex flex-col gap-1.5 mr-2 pt-5">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className="h-3 text-[10px] font-black text-slate-300 uppercase leading-3 w-7 text-right"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 잔디 그리드 */}
          {columns.map((col, colIdx) => {
            const firstDay = col[0]?.date;
            const dateObj = new Date(firstDay);
            const month = dateObj.getMonth();

            // 월 표시 로직: 현재 열이 월의 첫 번째 열이거나, 첫 번째 열인 경우
            const isFirstOfMonth =
              colIdx === 0 ||
              new Date(columns[colIdx - 1][0].date).getMonth() !== month;

            return (
              <div key={colIdx} className="flex flex-col gap-1.5">
                <div className="h-3 text-[10px] font-black text-slate-400 uppercase leading-3 mb-2">
                  {isFirstOfMonth ? MONTHS[month] : ""}
                </div>
                {col.map((day, dayIdx) => (
                  <div
                    key={`${colIdx}-${dayIdx}`}
                    title={getTooltip(day.date, day.minutes)}
                    className={`w-3 h-3 rounded-[3px] ${getColor(day.minutes)} cursor-pointer transition-all hover:scale-150 hover:z-10 hover:shadow-lg relative`}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 요약 및 범례 */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-slate-50 gap-4">
        <p className="text-[11px] font-bold text-slate-400 tracking-wider">
          올해 총{" "}
          <span className="text-blue-600 font-black">
            {totalStudyTime.toLocaleString()}
          </span>
          분 동안 몰입하셨네요!
        </p>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
            LESS
          </span>
          {[0, 20, 50, 100, 150, 200].map((m) => (
            <div key={m} className={`w-3 h-3 rounded-[3px] ${getColor(m)}`} />
          ))}
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            MORE
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudyGrass;
