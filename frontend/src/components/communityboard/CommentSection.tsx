import { useState } from 'react';
import { dateFormatter } from '../../utils/date';
import type { IComment } from '../../types/posts.type';
import type { IUser } from '../../types/user.type';
import { commentService } from '../../services/comment.service';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    postId:number;
    userInfo:IUser;
    initialComments:IComment[];
};

const CommentSection = ({
    postId,
    userInfo,
    initialComments, 
}: CommentSectionProps) => {

    const [comments,setComments] = useState<IComment[]>(initialComments);
    const [commentText, setCommentText] = useState('');

    const handleDeleteComment = async (postId:number,commentId:number) => {
        try {
            await commentService.deleteComment(postId,commentId);
            setComments(prev => 
                prev.filter(comment => comment.id !== commentId)
        );
        } catch (error) {
            console.log('댓글 삭제 실패',error);
            alert('댓글 삭제에 실패했습니다.');
        }
    }
    const handleUpdateComment = async (editComment:IComment) => {
        try {
            //API 호출
            await commentService.updateComment(editComment.id,editComment);
            //로컬 상태 반영
            setComments(prev => 
                prev.map(c => c.id === editComment.id ? editComment : c)
            );
            alert('댓글이 수정되었습니다.');
        } catch (error){
            console.log('댓글 수정 실패',error);
            alert('댓글 수정에 실패했습니다.');
        }
    }
    const handleCommentSubmit = async (newComment:IComment) => {
        if (newComment.content.trim() === '') {
            return 
        }

        try {
            const res = await commentService.createComment(postId,newComment);
    
            console.log('댓글 생성 완료',res);
            setComments(prev => [...prev, newComment]);
            alert('댓글이 작성되었습니다!');
            setCommentText('');
        } catch (error) {
            console.log('댓글 생성 실패',error);
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
                    onClick={()=>{handleCommentSubmit(
                        {
                            id: comments.length + 1,
                            author: userInfo.nickname,
                            authorId: userInfo.id,
                            authorAvatar: userInfo.avatar,
                            content: commentText.trim(),
                            createdAt: dateFormatter(),
                            updatedAt: dateFormatter(),
                            likes: 0
                        }
                    )}}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            
            {/* Comments List */}
            <div className="space-y-6">
                {comments.length > 0 && comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        userId={userInfo.id}
                        userRole={userInfo.role}
                        comment={comment}
                        handleUpdateComment={handleUpdateComment}
                        handleDeleteComment={() => {handleDeleteComment(postId,comment.id)}}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;