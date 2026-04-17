import { useCommentList, getDepth } from '../../hooks/useCommentList';
import { useCommentActions } from '../../hooks/useCommentActions';
import CommentItem from './CommentItem';
import CommentInput from './Comment.Input';
import useUserInfoStore from '../../store/userInfoStore';
import type { IBoardDetailResponse } from '../../types/Response/board.type';

interface CommentSectionProps {
    board: IBoardDetailResponse;
}

const CommentSection = ({ board }: CommentSectionProps) => {
    const userInfo = useUserInfoStore((state) => state.userInfo);
    const { comments, setComments, isLoading, observerRef } = useCommentList(board.boardId);
    const { handleDeleteComment, handleUpdateComment, handleCommentSubmit, handleLikeComment } = useCommentActions({
        boardId: board.boardId,
        setComments,
    });
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                댓글 <span className="text-indigo-600">{comments.length}</span>
            </h2>

            <CommentInput
                onSubmit={(content) => handleCommentSubmit(content, null)}
            />
            
            <div className="space-y-2">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.commentId}
                        userId={userInfo.userId}
                        userRole={userInfo.role}
                        comment={comment}
                        depth={getDepth(comment.commentPath)}
                        handleLikeComent={() => {handleLikeComment(comment.commentId,comment.isLiked)}}
                        handleUpdateComment={handleUpdateComment}
                        handleDeleteComment={() => handleDeleteComment(comment.commentId)}
                        handleReplySubmit={(content) =>
                            handleCommentSubmit(content, comment.commentPath)
                        }
                    />
                ))}
            </div>

            <div ref={observerRef} className="h-4 mt-4">
                {isLoading && (
                    <p className="text-center text-sm text-gray-400">불러오는 중...</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;