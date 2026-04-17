import { useState } from "react";
import { MoreVertical, Send, CornerDownRight } from "lucide-react";
import EditButton from "../button/EditButton";
import type { IBoardComment } from "../../types/Response/board.type";
import LikesButton from "../button/LikesButton";
import useUserInfoStore from "../../store/userInfoStore";

const MAX_DEPTH = 10;

interface CommentItemProps {
    userId: string;
    userRole: string;
    comment: IBoardComment;
    depth: number;
    handleLikeComent: (commentId:string, isLiked:boolean) => void;
    handleUpdateComment: (editComment: IBoardComment) => void;
    handleDeleteComment: () => void;
    handleReplySubmit: (content: string) => void;
}

const CommentItem = ({
    userId,
    userRole,
    comment,
    depth,
    handleLikeComent,
    handleUpdateComment,
    handleDeleteComment,
    handleReplySubmit,
}: CommentItemProps) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const userInfo = useUserInfoStore((state) => state.userInfo);

    const handleEdit = () => {
        setShowMoreMenu(false);
        setIsEditing(true);
    };

    const handleReplyConfirm = () => {
        if (!replyText.trim()) return;
        handleReplySubmit(replyText);
        setReplyText('');
        setIsReplying(false);
    };

    return (
        <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start space-x-2">

                {/* 들여쓰기 + 아이콘 */}
                {depth > 0 && (
                    <div
                        className="flex items-center flex-shrink-0 pt-1"
                        style={{ paddingLeft: `${(depth - 1) * 20}px` }}
                    >
                        <CornerDownRight size={14} className="text-gray-300" />
                    </div>
                )}

                {/* 아바타 */}
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {userInfo.profileAvatar}
                </div>

                <div className="flex-1 min-w-0">
                    {/* 닉네임 + 날짜 */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{comment.nickName}</span>
                            <span className="text-xs text-gray-400">{comment.createdAt}</span>
                        </div>
                        <div className="relative">
                            {(userId === comment.userId || userRole === 'admin') && (
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                >
                                    <MoreVertical size={16} />
                                </button>
                            )}
                            {showMoreMenu && (
                                <EditButton
                                    handleEdit={handleEdit}
                                    handleDelete={() => {
                                        handleDeleteComment();
                                        setShowMoreMenu(false);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* 수정 모드 */}
                    {isEditing ? (
                        <div className="flex mt-2 gap-2">
                            <textarea
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                                rows={1}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                onClick={() => {
                                    handleUpdateComment({ ...comment, content: editText });
                                    setIsEditing(false);
                                }}
                            >
                                <Send size={16} />
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* 댓글 내용 */}
                            <p className="text-gray-700 text-sm mb-2">
                                {comment.isDeleted
                                    ? <span className="text-gray-400 italic">삭제된 댓글입니다.</span>
                                    : comment.content
                                }
                            </p>

                            {/* 좋아요 + 답글 버튼 */}
                            <div className="flex items-center space-x-4">
                                <LikesButton
                                    likeCount={comment.likeCount}
                                    handleLikeCount={() => handleLikeComent(comment.commentId,comment.isLiked)}
                                />
                                {depth < MAX_DEPTH && (
                                    <button
                                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                                        onClick={() => setIsReplying(!isReplying)}
                                    >
                                        {isReplying ? '취소' : '답글'}
                                    </button>
                                )}
                            </div>

                            {/* 답글 입력창 */}
                            {isReplying && (
                                <div className="flex mt-3 gap-2">
                                    <textarea
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                                        rows={2}
                                        placeholder={`${comment.nickName}에게 답글...`}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        onClick={handleReplyConfirm}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;