import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { boardApi } from "../../api/boardApi";
import type { BoardDetail } from "../../types/board.type";
import useAuthStore from "../../stores/authStore";
import CommentSection from "../../components/board/CommentSection";

const BoardDetailPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();

  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const refreshBoard = async () => {
    if (!boardId) return;
    const res = await boardApi.getBoard(boardId);
    setBoard(res.data);
  };

  useEffect(() => {
    if (!boardId) return;
    const fetchBoard = async () => {
      try {
        const res = await boardApi.getBoard(boardId);
        setBoard(res.data);
      } catch {
        navigate("/board");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId, navigate]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    if (!board || likeLoading) return;
    setLikeLoading(true);
    try {
      if (board.isLiked) {
        await boardApi.unlikeBoard(board.boardId);
        setBoard({ ...board, isLiked: false, likeCount: board.likeCount - 1 });
      } else {
        await boardApi.likeBoard(board.boardId);
        setBoard({ ...board, isLiked: true, likeCount: board.likeCount + 1 });
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!board || !confirm("게시글을 정말 삭제할까요?")) return;
    try {
      await boardApi.deleteBoard(board.boardId);
      navigate("/board");
    } catch {
      alert("삭제에 실패했어요.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-xl" />
        <div className="h-[600px] bg-slate-50 rounded-[3rem]" />
      </div>
    );
  }

  if (!board) return null;

  const isOwner = String(user?.userId) === String(board.userId);
  const isAdmin = user?.role === "ADMIN";
  const isNotice = board.boardCategory === "NOTICE";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 상단 네비게이션 */}
      <nav className="flex items-center justify-between mb-12">
        <button
          onClick={() => navigate("/board")}
          className="group flex items-center gap-3 text-slate-900 hover:text-blue-600 transition-all font-black text-sm"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          목록으로 돌아가기
        </button>

        {(isOwner || isAdmin) && (
          <div className="flex items-center gap-3">
            {isOwner && (
              <Link
                to={`/board/${board.boardId}/edit`}
                className="px-7 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-[1.25rem] text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
              >
                수정
              </Link>
            )}
            <button
              onClick={handleDelete}
              className="px-7 py-3 bg-rose-50 text-rose-600 rounded-[1.25rem] text-xs font-black hover:bg-rose-600 hover:text-white transition-all"
            >
              삭제
            </button>
          </div>
        )}
      </nav>

      {/* 게시글 본체 */}
      <article className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
        {/* 헤더 섹션 */}
        <header className="p-12 md:p-16 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4 mb-10">
            <span
              className={`px-5 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full ${
                isNotice ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
              }`}
            >
              {isNotice ? "공지사항" : "커뮤니티"}
            </span>
            <time className="text-sm font-bold text-slate-400">
              {formatDate(board.createdAt)}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-14">
            {board.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-10">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-2xl shadow-slate-200">
                {board.nickName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">
                  {board.nickName}
                </p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  작성자
                </p>
              </div>
            </div>

            {/* 통계 정보 - 공지사항일 때 댓글 수 제외 */}
            <div className="flex items-center gap-10 border-l border-slate-100 pl-10">
              {[
                { label: "조회수", value: board.viewCount },
                { label: "좋아요", value: board.likeCount },
                ...(!isNotice
                  ? [{ label: "댓글", value: board.comment.length }]
                  : []),
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-base font-black text-slate-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* 본문 섹션 */}
        <section className="p-12 md:p-16">
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-800 leading-[2.1] whitespace-pre-wrap font-bold">
              {board.content}
            </p>
          </div>

          {/* 태그 리스트 */}
          {board.tags && board.tags.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-20">
              {board.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-6 py-3 bg-slate-50 text-slate-900 text-sm font-black rounded-2xl border border-slate-100 hover:border-slate-900 transition-all cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* 하단 좋아요 액션 */}
        <footer className="p-12 border-t border-slate-50 bg-slate-50/50 flex justify-center">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`group flex items-center gap-5 px-16 py-6 rounded-[2rem] transition-all active:scale-95 shadow-xl ${
              board.isLiked
                ? "bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600"
                : "bg-white text-slate-900 border border-slate-200 shadow-slate-100 hover:bg-slate-50"
            }`}
          >
            <span className="font-black text-base uppercase tracking-widest">
              {board.isLiked ? "공감함" : "공감하기"}
            </span>
            <div
              className={`w-[1px] h-5 ${board.isLiked ? "bg-rose-400" : "bg-slate-200"}`}
            />
            <span className="font-black text-xl">{board.likeCount}</span>
          </button>
        </footer>
      </article>

      {/* 댓글 영역 - NOTICE가 아닐 때만 노출 */}
      {!isNotice ? (
        <div className="mt-16">
          <CommentSection
            boardId={board.boardId}
            comments={board.comment}
            isLoggedIn={isLoggedIn}
            currentUserId={user?.userId}
            isAdmin={isAdmin}
            onRefresh={refreshBoard}
          />
        </div>
      ) : (
        <div className="mt-16 p-12 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-bold text-sm">
            공지사항은 댓글 작성이 제한된 게시글입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
