import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studyGroupApi } from "../../api/studyGroupApi";
import useAuthStore from "../../stores/authStore";

const DAY_OPTIONS = [
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
  { label: "일", value: "SUN" },
];

const CATEGORIES = [
  { label: "취업", value: "JOB" },
  { label: "자격증", value: "CERTIFICATE" },
  { label: "어학", value: "LANGUAGE" },
  { label: "기타", value: "ETC" },
];

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = ["00", "10", "20", "30", "40", "50"];

const StudyGroupUpdatePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // 시간/분 상태 관리
  const [hour, setHour] = useState("19");
  const [minute, setMinute] = useState("00");

  const [editForm, setEditForm] = useState({
    groupName: "",
    description: "",
    category: "JOB",
    isPrivate: false, // isPrivate 필드 추가
    dayOfWeek: "",
    studyTime: "",
  });

  useEffect(() => {
    if (!groupId) return;
    const fetchGroup = async () => {
      try {
        const res = await studyGroupApi.getGroup(groupId);
        const group = res.data;

        // 권한 체크 (방장만 수정 가능)
        if (String(user?.userId) !== String(group.leaderId)) {
          alert("방장만 수정할 수 있습니다.");
          navigate(`/study-group/${groupId}`);
          return;
        }

        setEditForm({
          groupName: group.groupName,
          description: group.description,
          category: group.category,
          isPrivate: group.isPrivate, // 기존 공개/비공개 여부 로드
          dayOfWeek: group.dayOfWeek,
          studyTime: group.studyTime,
        });

        // 시간 분리 (HH:mm -> hour, minute)
        if (group.studyTime && group.studyTime.includes(":")) {
          const [h, m] = group.studyTime.split(":");
          setHour(h);
          setMinute(m);
        }

        setSelectedDays(group.dayOfWeek ? group.dayOfWeek.split(",") : []);
        setTags(group.tags ?? []);
      } catch {
        navigate("/study-group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId, user, navigate]);

  // 시간 변경 시 form 업데이트
  useEffect(() => {
    setEditForm((prev) => ({ ...prev, studyTime: `${hour}:${minute}` }));
  }, [hour, minute]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (!trimmed || tags.length >= 10 || tags.includes(trimmed)) return;
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleSave = async () => {
    if (!groupId) return;
    setSaveLoading(true);
    try {
      await studyGroupApi.updateGroup(groupId, {
        ...editForm,
        dayOfWeek: selectedDays.join(","),
        tags,
      });
      navigate(`/study-group/${groupId}`);
    } catch {
      alert("정보 수정에 실패했어요.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-50 rounded-[2.5rem]" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      <header className="flex items-center gap-5 mb-12">
        <button
          onClick={() => navigate(`/study-group/${groupId}`)}
          className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white border border-slate-200 text-slate-900 hover:shadow-xl transition-all text-xl"
        >
          ←
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            그룹 정보 수정
          </h1>
          <p className="text-slate-600 font-bold text-sm mt-1">
            방장님, 변경된 스터디 정보를 업데이트 해주세요.
          </p>
        </div>
      </header>

      <div className="space-y-10">
        {/* [1] 기본 정보 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 space-y-12">
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              그룹 이름
            </label>
            <input
              type="text"
              value={editForm.groupName}
              onChange={(e) =>
                setEditForm({ ...editForm, groupName: e.target.value })
              }
              maxLength={30}
              className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0"
            />
          </div>
          <hr className="border-slate-50" />
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              그룹 설명
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={4}
              className="w-full text-lg font-bold text-slate-700 leading-relaxed placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0 resize-none"
            />
          </div>
        </section>

        {/* [2] 성격 및 태그 설정 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 space-y-12">
          {/* 공개 설정 추가 */}
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              공개 여부
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, isPrivate: false })}
                className={`flex-1 px-8 py-6 rounded-[2rem] border-2 transition-all text-left ${
                  !editForm.isPrivate
                    ? "border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-200"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <div className="text-lg mb-1">🔓</div>
                <div className="font-black text-sm">공개 그룹</div>
                <div className="text-[10px] font-bold opacity-60 mt-1">
                  누구나 검색하고 입장 가능
                </div>
              </button>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, isPrivate: true })}
                className={`flex-1 px-8 py-6 rounded-[2rem] border-2 transition-all text-left ${
                  editForm.isPrivate
                    ? "border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-200"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <div className="text-lg mb-1">🔒</div>
                <div className="font-black text-sm">비공개 그룹</div>
                <div className="text-[10px] font-bold opacity-60 mt-1">
                  초대 코드가 있어야 입장 가능
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-50" />

          {/* 카테고리 */}
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              카테고리
            </label>
            <div className="flex flex-wrap gap-4">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="peer hidden"
                    checked={editForm.category === c.value}
                    onChange={() =>
                      setEditForm({ ...editForm, category: c.value })
                    }
                  />
                  <div className="px-10 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-black peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white transition-all text-sm">
                    {c.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-50" />

          {/* 태그 */}
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              태그{" "}
              <span className="text-slate-400 lowercase font-bold ml-1">
                최대 10개
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:border-slate-200 transition-all">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-black rounded-xl border border-slate-200 shadow-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
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
                    : "태그가 가득 찼습니다"
                }
                disabled={tags.length >= 10}
                className="flex-1 min-w-[200px] bg-transparent outline-none text-sm font-black text-slate-900 placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        {/* [3] 일정 수정 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 space-y-12">
          <div>
            <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
              진행 일정 수정
            </label>
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() =>
                      setSelectedDays((prev) =>
                        prev.includes(day.value)
                          ? prev.filter((d) => d !== day.value)
                          : [...prev, day.value],
                      )
                    }
                    className={`w-12 h-12 rounded-[1rem] text-sm font-black transition-all ${
                      selectedDays.includes(day.value)
                        ? "bg-slate-900 text-white shadow-xl"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>

              {/* 커스텀 시간 선택기 */}
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
                <span className="pr-4 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">
                  Meeting Time
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-end gap-5 pt-8">
          <button
            type="button"
            onClick={() => navigate(`/study-group/${groupId}`)}
            className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-50 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saveLoading || !editForm.groupName.trim()}
            className="px-20 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 text-lg disabled:opacity-50"
          >
            {saveLoading ? "저장 중..." : "수정 완료"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StudyGroupUpdatePage;
