import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studyGroupApi } from "../../api/studyGroupApi";
import type { StudyGroup } from "../../types/studyGroup.type";
import useAuthStore from "../../stores/authStore";
import InviteCodeModal from "../../components/common/InviteCodeModal";

const CATEGORIES = [
  { label: "전체", value: "전체" },
  { label: "취업", value: "JOB" },
  { label: "자격증", value: "CERTIFICATE" },
  { label: "어학", value: "LANGUAGE" },
  { label: "기타", value: "ETC" },
];

const CATEGORY_MAP = CATEGORIES.reduce(
  (acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  },
  {} as Record<string, string>,
);

const StudyGroupListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("전체");
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res =
          category === "전체"
            ? await studyGroupApi.getAllGroups(keyword || undefined)
            : await studyGroupApi.getGroupsByCategory(
                category,
                keyword || undefined,
              );
        setGroups(res.data);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [category, keyword]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setKeyword("");
    setSearchInput("");
  };

  const handleSearch = () => {
    setKeyword(searchInput);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션: 버튼 스타일 통일 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            스터디 탐색
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            함께 성장할 동료를 찾고 목표를 달성해 보세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-sm font-black transition-all hover:bg-slate-900 hover:text-white active:scale-95"
          >
            초대코드로 입장
          </button>
          <button
            onClick={() =>
              isLoggedIn ? navigate("/study-group/create") : navigate("/signin")
            }
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            새 그룹 만들기
          </button>
        </div>
      </div>

      {/* 1. 카테고리 필터: 검색창 위로 이동 및 Hover 두께감 적용 */}
      <div className="mb-6 flex flex-wrap gap-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCategoryChange(c.value)}
            className={`
              px-6 py-3 rounded-2xl text-xs font-black transition-all border-2
              ${
                category === c.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900"
              }
            `}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 2. 검색 바: 통일된 볼드 스타일 */}
      <div className="flex items-center gap-3 mb-12">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="스터디 그룹 검색"
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

      {/* 리스트 그리드 영역 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <button
              key={group.groupId}
              onClick={() => navigate(`/study-group/${group.groupId}`)}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-slate-900 transition-all text-left flex flex-col justify-between h-72 shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-slate-100 bg-slate-900 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                    {CATEGORY_MAP[group.category] || group.category}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-tighter ${
                      group.isPrivate
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {group.isPrivate ? "비공개" : "공개"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-1 mb-2">
                  {group.groupName}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed">
                  {group.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {group.tags?.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-900">
                  <b className="text-slate-900">{group.currentMembers}</b> /{" "}
                  {group.maxMembers} 명
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
      )}

      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-900 font-black text-lg">
            해당하는 스터디가 없어요.
          </p>
          {keyword && (
            <button
              onClick={() => {
                setCategory("전체");
                setKeyword("");
                setSearchInput("");
              }}
              className="mt-4 text-slate-900 font-bold text-sm underline underline-offset-4"
            >
              전체 목록 보기
            </button>
          )}
        </div>
      )}

      <InviteCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="GROUP"
      />
    </div>
  );
};

export default StudyGroupListPage;
