import { useState } from "react";
import { commentApi } from "../../api/commentApi";
import type { CommentDto } from "../../types/board.type";

interface CommentItemProps {
  comment: CommentDto;
  depth: number;
  currentUserId?: string;
  isAdmin?: boolean;
  isLoggedIn: boolean;
  onLike: (commentId: string, isLiked: boolean) => void;
  onDelete: (commentId: string) => void;
  onRefresh: () => Promise<void>;
  formatDate: (dateStr: string) => string;
}

const CommentItem = ({
  comment,
  depth,
  currentUserId,
  isAdmin,
  isLoggedIn,
  onLike,
  onDelete,
  onRefresh,
  formatDate,
}: CommentItemProps) => {
  const isOwner = currentUserId === comment.userId;
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setReplyLoading(true);
    try {
      await commentApi.createComment({
        boardId: comment.boardId,
        content: replyContent,
        parentPath: comment.commentPath,
      });
      setReplyContent("");
      setShowReply(false);
      await onRefresh();
    } catch {
      alert("답글 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div
      className={`font-['Pretendard_Variable'] ${
        depth > 0 ? "bg-slate-50/40" : "bg-white"
      } border-b border-slate-100 last:border-0 transition-colors`}
    >
      <div
        className="flex gap-4 p-6 md:p-8"
        style={{ paddingLeft: `${1.5 + depth * 2}rem` }}
      >
        {/* 답글 인디케이터 */}
        {depth > 0 && (
          <div className="text-slate-300 text-xl mt-[-2px] font-light select-none">
            ↳
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* 작성자 정보 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-100">
                <span className="font-black text-xs">
                  {comment.nickName?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900">
                  {comment.nickName}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* 댓글 본문 내용 */}
          <div className={`${depth > 0 ? "pl-2" : "pl-0"}`}>
            {comment.isDeleted ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                <span className="text-xs text-slate-400 font-bold italic">
                  삭제된 댓글입니다.
                </span>
              </div>
            ) : (
              <p className="text-[15px] text-slate-700 leading-relaxed font-medium break-words">
                {comment.content}
              </p>
            )}

            {/* 하단 액션 바 */}
            {!comment.isDeleted && (
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => onLike(comment.commentId, comment.isLiked)}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 border ${
                    comment.isLiked
                      ? "bg-rose-50 text-rose-500 border-rose-100 shadow-sm"
                      : "bg-white text-slate-400 border-slate-100 hover:border-rose-200 hover:text-rose-500 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm leading-none">
                    {comment.isLiked ? "❤️" : "🤍"}
                  </span>
                  {comment.likeCount.toLocaleString()}
                </button>

                {isLoggedIn && depth < 4 && (
                  <button
                    onClick={() => setShowReply(!showReply)}
                    className={`px-4 py-2 rounded-full text-xs font-black tracking-tight transition-all border ${
                      showReply
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900 hover:shadow-md"
                    }`}
                  >
                    답글 달기
                  </button>
                )}

                {(isOwner || isAdmin) && (
                  <button
                    onClick={() => onDelete(comment.commentId)}
                    className="ml-auto px-3 py-2 text-xs font-black text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest"
                  >
                    삭제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 답글 입력 필드 */}
      {showReply && (
        <div
          className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300"
          style={{ paddingLeft: `${3.5 + depth * 2}rem` }}
        >
          <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-900 shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <span className="text-blue-600">REPLY TO</span> {comment.nickName}
            </div>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 남겨보세요..."
              rows={3}
              className="w-full px-0 py-2 bg-transparent text-base font-bold placeholder:text-slate-200 focus:outline-none resize-none border-none focus:ring-0"
            />
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
              <button
                onClick={() => {
                  setShowReply(false);
                  setReplyContent("");
                }}
                className="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={replyLoading || !replyContent.trim()}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-20 active:scale-95"
              >
                {replyLoading ? "등록 중..." : "답글 등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
