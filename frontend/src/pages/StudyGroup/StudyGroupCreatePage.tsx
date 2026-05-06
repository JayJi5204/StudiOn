import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studyGroupApi } from "../../api/studyGroupApi";
import type { CreateGroupRequest } from "../../types/studyGroup.type";
import useAuthStore from "../../stores/authStore";

const CATEGORIES = [
  { label: "취업", value: "JOB" },
  { label: "자격증", value: "CERTIFICATE" },
  { label: "어학", value: "LANGUAGE" },
  { label: "기타", value: "ETC" },
];

const DAY_OPTIONS = [
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
  { label: "일", value: "SUN" },
];

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = ["00", "10", "20", "30", "40", "50"];

const StudyGroupCreatePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [hour, setHour] = useState("19");
  const [minute, setMinute] = useState("00");

  const [createForm, setCreateForm] = useState<CreateGroupRequest>({
    groupName: "",
    description: "",
    category: "JOB",
    isPrivate: false,
    dayOfWeek: "",
    studyTime: "",
    tags: [],
  });

  useEffect(() => {
    setCreateForm((prev) => ({ ...prev, studyTime: `${hour}:${minute}` }));
  }, [hour, minute]);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (!trimmed || tags.length >= 10 || tags.includes(trimmed)) return;
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleCreate = async () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    if (!createForm.groupName.trim()) return;

    setCreateLoading(true);
    try {
      // 비판적 수정: createForm에 있는 모든 최신 상태(isPrivate 포함)를 확실히 전달
      const payload: CreateGroupRequest = {
        ...createForm,
        dayOfWeek: selectedDays.join(","),
        tags: tags,
      };

      const res = await studyGroupApi.createGroup(payload);
      navigate(`/study-group/${res.data.groupId}`);
    } catch (error) {
      console.error("Group creation error:", error);
      alert("그룹 생성에 실패했어요.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-['Pretendard_Variable']">
      <header className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:shadow-md transition-all text-xl"
        >
          ←
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            스터디 그룹 만들기
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-1">
            새로운 스터디 그룹의 상세 정보를 입력해주세요.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        {/* [1] 기본 정보 */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 space-y-10">
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              그룹 이름
            </label>
            <input
              type="text"
              value={createForm.groupName}
              onChange={(e) =>
                setCreateForm({ ...createForm, groupName: e.target.value })
              }
              placeholder="예: Java 백엔드 스터디"
              maxLength={30}
              className="w-full text-2xl font-bold text-slate-800 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0"
            />
          </div>
          <hr className="border-slate-50" />
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              그룹 설명
            </label>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
              placeholder="스터디의 목적과 규칙을 상세히 적어주세요."
              rows={4}
              className="w-full text-[17px] font-medium text-slate-700 leading-[1.8] placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0 resize-none"
            />
          </div>
        </section>

        {/* [2] 카테고리 & 태그 */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 space-y-10">
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              카테고리
            </label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="peer hidden"
                    checked={createForm.category === c.value}
                    onChange={() =>
                      setCreateForm({ ...createForm, category: c.value })
                    }
                  />
                  <div className="px-8 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-bold peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm">
                    {c.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-slate-50" />
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              태그{" "}
              <span className="text-slate-400 lowercase font-medium ml-1">
                최대 10개
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-3 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 focus-within:bg-white focus-within:border-slate-200 transition-all">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={
                  tags.length < 10
                    ? "태그 입력 후 Enter"
                    : "태그가 모두 추가되었습니다"
                }
                disabled={tags.length >= 10}
                className="flex-1 min-w-[200px] bg-transparent outline-none text-sm font-bold text-slate-600 placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        {/* [3] 스케줄 & 공개 설정 */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 space-y-10">
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              진행 일정
            </label>
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${selectedDays.includes(day.value) ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100 font-bold"}`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="appearance-none bg-transparent border-none text-base font-black text-slate-900 outline-none focus:ring-0 cursor-pointer pr-1"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}시
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-300 font-bold mx-1">:</span>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="appearance-none bg-transparent border-none text-base font-black text-slate-900 outline-none focus:ring-0 cursor-pointer"
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {m}분
                      </option>
                    ))}
                  </select>
                </div>
                <span className="pr-4 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Start Time
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-50" />

          {/* 💡 공개 설정 UI 개선 */}
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4">
              공개 여부 설정
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() =>
                  setCreateForm({ ...createForm, isPrivate: false })
                }
                className={`flex-1 p-6 rounded-[1.5rem] border-2 transition-all text-left ${
                  !createForm.isPrivate
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <div className="text-lg mb-1">🔓</div>
                <div className="font-black text-sm">전체 공개</div>
                <div className="text-[10px] font-bold opacity-60 mt-1 leading-tight">
                  모든 사용자가 검색하고
                  <br />
                  자유롭게 참여 가능합니다.
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setCreateForm({ ...createForm, isPrivate: true })
                }
                className={`flex-1 p-6 rounded-[1.5rem] border-2 transition-all text-left ${
                  createForm.isPrivate
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <div className="text-lg mb-1">🔒</div>
                <div className="font-black text-sm">비공개 그룹</div>
                <div className="text-[10px] font-bold opacity-60 mt-1 leading-tight">
                  초대 코드를 가진 사용자만
                  <br />
                  입장할 수 있습니다.
                </div>
              </button>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/study-group")}
            className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-sm font-black hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={createLoading || !createForm.groupName.trim()}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {createLoading ? "생성 중..." : "그룹 생성하기"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StudyGroupCreatePage;
