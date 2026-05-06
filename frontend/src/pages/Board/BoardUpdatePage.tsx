import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { boardApi } from "../../api/boardApi";
import useAuthStore from "../../stores/authStore";
import type { BoardCategory } from "../../types/board.type";

const BoardUpdatePage = () => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { isLoggedIn, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardCategory, setCategory] = useState<BoardCategory>("COMMUNITY"); // 카테고리 상태 추가
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    if (!boardId) return;

    const fetchBoard = async () => {
      try {
        const res = await boardApi.getBoard(boardId);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.boardCategory); // 기존 카테고리 설정
        setTags(res.data.tags ?? []);
      } catch {
        navigate("/board");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchBoard();
  }, [boardId, isLoggedIn, navigate]);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (!trimmed || tags.length >= 5 || tags.includes(trimmed)) return;
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    if (!boardId) return;
    setError("");
    setLoading(true);
    try {
      // 수정 요청 시 boardCategory 포함
      await boardApi.updateBoard(boardId, {
        title,
        content,
        boardCategory,
        tags,
      });
      navigate(`/board/${boardId}`);
    } catch {
      setError(
        "게시글 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 animate-pulse">
        <div className="flex gap-6 items-center">
          <div className="w-14 h-14 bg-slate-100 rounded-[1.25rem]" />
          <div className="h-12 w-64 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-24 bg-slate-50 rounded-[3rem]" />
        <div className="h-32 bg-slate-50 rounded-[3rem]" />
        <div className="h-96 bg-slate-50 rounded-[3rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션 */}
      <header className="flex items-center gap-8 mb-16">
        <button
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] bg-white border-2 border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:shadow-xl transition-all text-2xl"
        >
          ←
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            게시글 수정
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2">
            내용을 다듬어 더 완벽한 지식을 공유해 보세요.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 카테고리 선택 섹션 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
            카테고리 변경
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "자유게시판", value: "COMMUNITY" },
              { label: "질문/답변", value: "QUESTION" },
              { label: "공지사항", value: "NOTICE", adminOnly: true },
            ]
              .filter((cat) => !cat.adminOnly || user?.role === "ADMIN")
              .map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as BoardCategory)}
                  className={`px-8 py-4 rounded-2xl text-sm font-black transition-all ${
                    boardCategory === cat.value
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
          </div>
        </section>

        {/* 제목 섹션 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 transition-all focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-50">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
            제목 수정
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해 주세요"
            maxLength={100}
            className="w-full text-4xl font-black text-slate-900 placeholder:text-slate-100 outline-none border-none p-0 focus:ring-0"
          />
        </section>

        {/* 본문 섹션 */}
        <section className="bg-white rounded-[3.5rem] shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-50">
          <div className="px-12 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              본문 수정
            </label>
            <span className="text-[11px] font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100">
              {content.length.toLocaleString()} 자 작성됨
            </span>
          </div>
          <textarea
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공유하고 싶은 내용을 상세히 적어주세요."
            className="w-full px-12 py-12 text-xl font-bold text-slate-800 leading-[2] outline-none border-none resize-none focus:ring-0 placeholder:text-slate-100 min-h-[500px]"
          />
        </section>

        {/* 태그 섹션 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">
            해시태그 관리 <span className="text-slate-300 ml-2">#최대 5개</span>
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-2xl transition-all hover:bg-rose-600"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setTags((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-slate-400 group-hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={
                tags.length < 5 ? "태그 입력 후 Enter" : "태그가 모두 찼습니다"
              }
              disabled={tags.length >= 5}
              className="flex-1 min-w-[250px] py-3 bg-transparent outline-none text-base font-black text-slate-900 placeholder:text-slate-200"
            />
          </div>
        </section>

        {error && (
          <div className="px-10 py-6 bg-rose-50 border-2 border-rose-100 rounded-[2rem] text-rose-600 text-sm font-black flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-6 h-6 flex items-center justify-center bg-rose-600 text-white rounded-full text-[12px]">
              !
            </div>
            {error}
          </div>
        )}

        {/* 하단 액션 버튼 */}
        <footer className="flex items-center justify-end gap-6 pt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-12 py-6 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl font-black text-base hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 transition-all"
          >
            취소하고 돌아가기
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-24 py-6 bg-slate-900 text-white rounded-3xl font-black text-base shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-30"
          >
            {loading ? "수정 사항 저장 중..." : "수정 완료"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default BoardUpdatePage;
