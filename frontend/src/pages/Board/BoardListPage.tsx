import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { boardApi } from "../../api/boardApi";
import type { Board, BoardCategory } from "../../types/board.type";
import useAuthStore from "../../stores/authStore";

const CATEGORIES: { label: string; value: BoardCategory | "ALL" }[] = [
  { label: "전체", value: "ALL" },
  { label: "자유게시판", value: "COMMUNITY" },
  { label: "질문/답변", value: "QUESTION" },
  { label: "공지사항", value: "NOTICE" },
];

const CATEGORY_LABELS: Record<string, string> = {
  COMMUNITY: "자유게시판",
  QUESTION: "질문/답변",
  NOTICE: "공지사항",
};

const BoardListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [notices, setNotices] = useState<Board[]>([]);
  const [boardCategory, setCategory] = useState<BoardCategory | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const res = await boardApi.getBoards(
          page,
          10,
          boardCategory === "ALL" ? undefined : boardCategory,
          keyword || undefined,
        );

        const all: Board[] = res.data.content || [];

        if (boardCategory === "ALL") {
          setNotices(all.filter((b) => b.boardCategory === "NOTICE"));
          setBoards(all.filter((b) => b.boardCategory !== "NOTICE"));
        } else if (boardCategory === "NOTICE") {
          setNotices(all);
          setBoards([]);
        } else {
          setNotices([]);
          setBoards(all);
        }

        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setBoards([]);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [page, boardCategory, keyword]);

  const handleCategoryChange = (value: BoardCategory | "ALL") => {
    setCategory(value);
    setPage(0);
    setKeyword("");
    setSearchInput("");
  };

  const handleSearch = () => {
    setPage(0);
    setKeyword(searchInput);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\.$/, "");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            커뮤니티
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            학습 여정과 지식을 자유롭게 공유해 보세요.
          </p>
        </div>
        <button
          onClick={() =>
            isLoggedIn ? navigate("/write-post") : navigate("/signin")
          }
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
        >
          새 글 작성하기
        </button>
      </div>

      {/* 카테고리 필터 - 두께감 있는 Hover 스타일 적용 */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 md:pb-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            /* border-2를 기본으로 깔고 hover 시 slate-900으로 두께감 통일 */
            className={`
        px-7 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all border-2 whitespace-nowrap
        ${
          boardCategory === cat.value
            ? "bg-slate-900 text-white border-slate-900 shadow-md" // 선택된 상태
            : "bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900" // 기본 및 호버 상태
        }
      `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 검색창 - 스터디룸 리스트와 통일된 디자인 */}
      <div className="flex items-center gap-3 mb-12">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="제목 또는 내용으로 검색"
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

      {/* 게시판 테이블 구조 */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-10 py-5 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-2 text-center">카테고리</div>
          <div className="col-span-4">제목</div>
          <div className="col-span-2 text-center">작성자</div>
          <div className="col-span-2 text-center">날짜</div>
          <div className="col-span-1 text-center">조회수</div>
          <div className="col-span-1 text-center">좋아요</div>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {/* 공지사항 목록 */}
            {notices.map((board) => (
              <Link
                key={board.boardId}
                to={`/board/${board.boardId}`}
                className="grid grid-cols-12 gap-4 px-10 py-6 items-center bg-rose-50/30 hover:bg-rose-50 transition-all group"
              >
                <div className="col-span-2 flex justify-center">
                  <span className="bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Notice
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                    {board.title}
                  </h3>
                </div>
                <div className="col-span-2 flex justify-center items-center gap-2">
                  <div className="w-5 h-5 bg-slate-900 text-white rounded-md flex items-center justify-center text-[9px] font-black">
                    {board.nickName?.[0] || "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-600 truncate">
                    {board.nickName}
                  </span>
                </div>
                <div className="col-span-2 text-center text-[11px] font-bold text-slate-400">
                  {formatDate(board.createdAt)}
                </div>
                <div className="col-span-1 text-center text-sm font-black text-slate-700">
                  {board.viewCount}
                </div>
                <div className="col-span-1 text-center text-sm font-black text-rose-500">
                  {board.likeCount}
                </div>
              </Link>
            ))}

            {/* 일반 게시글 목록 */}
            {boards.length > 0
              ? boards.map((board) => (
                  <Link
                    key={board.boardId}
                    to={`/board/${board.boardId}`}
                    className="grid grid-cols-12 gap-4 px-10 py-6 items-center hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="col-span-2 flex justify-center">
                      <span className="text-[10px] font-black text-slate-50 bg-slate-900 px-2 py-0.5 rounded tracking-tighter">
                        {CATEGORY_LABELS[board.boardCategory] || "자유게시판"}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center gap-2 min-w-0">
                      <h3 className="text-base font-black text-slate-900 group-hover:text-slate-600 transition-colors truncate">
                        {board.title}
                      </h3>
                      {board.commentCount > 0 && (
                        <span className="text-slate-400 font-bold text-sm shrink-0">
                          [{board.commentCount}]
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-center items-center gap-2">
                      <div className="w-5 h-5 bg-slate-200 text-slate-500 rounded-md flex items-center justify-center text-[9px] font-black">
                        {board.nickName?.[0] || "U"}
                      </div>
                      <span className="text-xs font-bold text-slate-600 truncate">
                        {board.nickName}
                      </span>
                    </div>
                    <div className="col-span-2 text-center text-[11px] font-bold text-slate-400">
                      {formatDate(board.createdAt)}
                    </div>
                    <div className="col-span-1 text-center text-sm font-black text-slate-700">
                      {board.viewCount}
                    </div>
                    <div className="col-span-1 text-center text-sm font-black text-slate-700">
                      {board.likeCount}
                    </div>
                  </Link>
                ))
              : notices.length === 0 && (
                  <div className="py-20 text-center text-slate-300 font-bold">
                    등록된 게시글이 없습니다.
                  </div>
                )}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                page === i
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-white border border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardListPage;
