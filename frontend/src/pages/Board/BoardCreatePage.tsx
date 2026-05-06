import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { boardApi } from "../../api/boardApi";
import useAuthStore from "../../stores/authStore";
import type { BoardCategory } from "../../types/board.type";

const BoardCreatePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardCategory, setCategory] = useState<BoardCategory>("COMMUNITY");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

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
    setError("");
    setLoading(true);
    try {
      await boardApi.createBoard({
        title,
        content,
        boardCategory,
        tags,
      });
      // 성공 시 게시판 목록 페이지로 이동
      navigate("/board");
    } catch {
      setError("글 저장에 실패했습니다. 네트워크 상태를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션 */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white border border-slate-200 text-slate-900 hover:shadow-xl transition-all text-xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              새 게시글 작성
            </h1>
            <p className="text-slate-600 font-bold text-sm mt-1">
              커뮤니티와 함께 나누고 싶은 이야기를 적어주세요.
            </p>
          </div>
        </div>

        {user?.role === "ADMIN" && (
          <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest">
              관리자 모드 활성화
            </span>
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 카테고리 선택 섹션 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200">
          <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">
            카테고리 선택
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
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200 transition-all focus-within:border-slate-900 focus-within:shadow-lg">
          <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해 주세요"
            maxLength={100}
            className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0"
          />
        </section>

        {/* 본문 섹션 */}
        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:border-slate-900 focus-within:shadow-lg">
          <div className="px-12 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <label className="text-[13px] font-black text-slate-900 uppercase tracking-[0.2em]">
              내용
            </label>
            <span className="text-xs font-bold text-slate-400">
              {content.length.toLocaleString()}자 작성 중
            </span>
          </div>
          <textarea
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이곳에 내용을 자유롭게 작성해 주세요."
            className="w-full px-12 py-10 text-lg font-bold text-slate-700 leading-relaxed outline-none border-none resize-none focus:ring-0 placeholder:text-slate-200"
          />
        </section>

        {/* 태그 섹션 */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-200">
          <label className="block text-[13px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">
            해시태그{" "}
            <span className="text-slate-400 lowercase font-bold ml-1">
              최대 5개
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:border-slate-200 transition-all">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setTags((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-slate-400 group-hover:text-rose-400 transition-colors"
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
                tags.length < 5 ? "태그 입력 후 Enter" : "태그 한도 도달"
              }
              disabled={tags.length >= 5}
              className="flex-1 min-w-[200px] bg-transparent outline-none text-sm font-black text-slate-900 placeholder:text-slate-300"
            />
          </div>
        </section>

        {/* 에러 메시지 */}
        {error && (
          <div className="px-10 py-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 text-sm font-black flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <span className="w-6 h-6 flex items-center justify-center bg-rose-600 text-white rounded-full text-[12px] shrink-0">
              !
            </span>
            {error}
          </div>
        )}

        {/* 하단 액션 버튼 */}
        <footer className="flex items-center justify-end gap-5 pt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-50 transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-20 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-30 text-lg"
          >
            {loading ? "발행 중..." : "글 발행하기"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default BoardCreatePage;
