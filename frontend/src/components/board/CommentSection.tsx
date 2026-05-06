import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { commentApi } from "../../api/commentApi";
import type { CommentDto } from "../../types/board.type";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  boardId: string;
  comments: CommentDto[];
  isLoggedIn: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
  onRefresh: () => Promise<void>;
}

const CommentSection = ({
  boardId,
  comments,
  isLoggedIn,
  currentUserId,
  isAdmin,
  onRefresh,
}: CommentSectionProps) => {
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDepth = (commentPath: string) => {
    return Math.floor(commentPath.length / 5) - 1;
  };

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    if (!commentContent.trim()) return;
    setCommentLoading(true);
    try {
      await commentApi.createComment({ boardId, content: commentContent });
      setCommentContent("");
      await onRefresh();
    } catch {
      alert("댓글 작성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    try {
      if (isLiked) {
        await commentApi.unlikeComment(commentId);
      } else {
        await commentApi.likeComment(commentId);
      }
      await onRefresh();
    } catch {
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("댓글을 정말 삭제하시겠습니까?")) return;
    try {
      await commentApi.deleteComment(commentId);
      await onRefresh();
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const sortComments = (comments: CommentDto[]) => {
    const result: CommentDto[] = [];
    const roots = comments.filter((c) => c.commentPath.length === 5);
    roots.sort((a, b) => a.commentPath.localeCompare(b.commentPath));

    roots.forEach((root) => {
      result.push(root);
      const children = comments
        .filter(
          (c) =>
            c.commentPath.length > 5 &&
            c.commentPath.startsWith(root.commentPath),
        )
        .sort((a, b) => a.commentPath.localeCompare(b.commentPath));
      children.forEach((child) => result.push(child));
    });

    return result;
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden font-['Pretendard_Variable']">
      {/* 섹션 헤더 */}
      <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            의견 나누기
          </h2>
          <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black">
            {comments.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            실시간 토론 중
          </span>
        </div>
      </div>

      {/* 댓글 작성 영역 */}
      <div className="p-10 bg-slate-50/30">
        {isLoggedIn ? (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="지식 공유나 궁금한 점을 자유롭게 남겨보세요."
                rows={4}
                className="w-full px-8 py-7 bg-white border-2 border-slate-100 rounded-[2rem] text-base font-bold placeholder:text-slate-200 focus:outline-none focus:border-slate-900 transition-all shadow-sm resize-none focus:ring-0"
              />
              <div className="absolute bottom-6 right-8 flex items-center gap-4">
                <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest">
                  {commentContent.length.toLocaleString()} 자 작성 중
                </span>
                <button
                  onClick={handleCommentSubmit}
                  disabled={commentLoading || !commentContent.trim()}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:shadow-xl transition-all disabled:opacity-10 active:scale-95"
                >
                  {commentLoading ? "등록 중..." : "댓글 등록하기"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 px-8 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
            <p className="text-base font-bold text-slate-400 mb-6">
              로그인 후 스터디원들과 의견을 나눠보세요.
            </p>
            <Link
              to="/signin"
              className="inline-flex px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100"
            >
              로그인하고 참여하기
            </Link>
          </div>
        )}
      </div>

      {/* 댓글 리스트 영역 */}
      <div className="divide-y divide-slate-50">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center bg-white">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <span className="text-3xl grayscale opacity-30">💬</span>
            </div>
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
              첫 번째 의견을 남겨주세요
            </h3>
          </div>
        ) : (
          sortComments(comments).map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              depth={getDepth(comment.commentPath)}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
              onLike={handleCommentLike}
              onDelete={handleCommentDelete}
              onRefresh={onRefresh}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* 섹션 푸터 */}
      <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-relaxed">
          서로를 존중하는 마음으로 건강한 스터디 문화를 만들어가요.
        </p>
      </div>
    </div>
  );
};

export default CommentSection;
