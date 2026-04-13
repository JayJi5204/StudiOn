import { commentService } from '../services/comment.service';
import type { IBoardComment } from '../types/Response/board.type';

interface UseCommentActionsProps {
    boardId: string;
    setComments: React.Dispatch<React.SetStateAction<IBoardComment[]>>;
}

export const useCommentActions = ({ boardId, setComments }: UseCommentActionsProps) => {

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.commentId !== commentId));
        } catch {
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleUpdateComment = async (editComment: IBoardComment) => {
        try {
            await commentService.updateComment(editComment.commentId, editComment.content);
            setComments(prev =>
                prev.map(c => c.commentId === editComment.commentId ? editComment : c)
            );
        } catch {
            alert('댓글 수정에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async (
        content: string,
        parentPath: string | null,
        onSuccess?: () => void
    ) => {
        if (!content.trim()) return;
        try {
            const response = await commentService.createComment({
                boardId,
                content: content.trim(),
                parentPath,
            });

            const newComment: IBoardComment = {
                commentId: response.commentId,
                userId: response.userId,
                nickName: response.nickName,
                content: response.content,
                commentPath: response.commentPath,
                parentPath,
                likeCount: response.likeCount,
                isDeleted: response.isDeleted,
                createdAt: response.createdAt,
                modifiedAt: response.createdAt,
            };

            if (parentPath) {
                setComments(prev => {
                    const parentIndex = prev.reduce((lastIdx, c, idx) =>
                        c.commentPath === parentPath || c.commentPath.startsWith(parentPath)
                            ? idx : lastIdx, -1
                    );
                    const next = [...prev];
                    next.splice(parentIndex + 1, 0, newComment);
                    return next;
                });
            } else {
                setComments(prev => [...prev, newComment]);
            }

            onSuccess?.();
        } catch {
            alert('댓글 작성에 실패했습니다.');
        }
    };

    return { handleDeleteComment, handleUpdateComment, handleCommentSubmit };
};