import { useState } from 'react';
import { dateFormatter } from '../../utils/date';
import type { IComment } from '../../types/boards.type';
import { commentService } from '../../services/comment.service';
import CommentItem from './CommentItem';
import { useComments } from '../../hooks/useComments';
import useUserInfoStore from '../../store/userInfoStore';

interface CommentSectionProps {
    boardId: string;
};

const CommentSection = ({
    boardId,
}: CommentSectionProps) => {

    const { comments, setComments } = useComments({ boardId });
    const [commentText, setCommentText] = useState('');
    const userInfo = useUserInfoStore((state) => state.userInfo);

    const handleDeleteComment = async (
        boardId: string,
        commentId: number
    ) => {
        try {
            await commentService.deleteComment(boardId, commentId);
            setComments(prev =>
                prev.filter(comment => comment.commentId !== commentId)
            );
        } catch (error) {
            console.log('댓글 삭제 실패', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleUpdateComment = async (
        editComment: IComment
    ) => {
        try {
            await commentService.updateComment(editComment.commentId, editComment);
            setComments(prev =>
                prev.map(comment => comment.commentId === editComment.commentId ? editComment : comment)
            );
            alert('댓글이 수정되었습니다.');
        } catch (error) {
            console.log('댓글 수정 실패', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async (newComment: IComment) => {
        if (newComment.content.trim() === '') {
            return;
        }

        try {
            const res = await commentService.createComment(boardId, newComment);
            console.log('댓글 생성 완료', res);
            setComments(prev => [...prev, newComment]);
            alert('댓글이 작성되었습니다!');
            setCommentText('');
        } catch (error) {
            console.log('댓글 생성 실패', error);
            alert('댓글 작성에 실패했습니다.');
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                댓글 <span className="text-indigo-600">{comments.length}</span>
            </h2>

            {/* Comment Input */}
            <div className="mb-8">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => {
                            handleCommentSubmit(
                                {
                                    commentId: comments.length + 1,
                                    userId: userInfo.userId,
                                    boardId: boardId,
                                    content: commentText.trim(),
                                    createdAt: dateFormatter(),
                                    modifiedAt: dateFormatter(),
                                    likeCount: 0
                                }
                            );
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        댓글 작성
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.commentId}
                        userId={userInfo.userId}
                        userRole={userInfo.role}
                        comment={comment}
                        handleUpdateComment={handleUpdateComment}
                        handleDeleteComment={() => { handleDeleteComment(String(boardId), comment.commentId); }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
