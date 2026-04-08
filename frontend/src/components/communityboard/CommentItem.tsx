import { useState } from "react";
import { MoreVertical,ThumbsUp, Send } from "lucide-react";
import EditButton from "../button/EditButton";
import type { IComment } from "../../types/boards.type";
import useUserInfoStore from "../../store/userInfoStore";

interface CommentItemProps {
    userId:number;
    userRole:string;
    comment:IComment;
    handleUpdateComment: (editComment:IComment) => void;
    handleDeleteComment: () => void;
}

const CommentItem = (
    {
        userId,
        userRole,
        comment,
        handleUpdateComment,
        handleDeleteComment,
    }:CommentItemProps) => {
    const userInfo = useUserInfoStore((state) => state.userInfo);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const handleEdit = () => {
        setShowMoreMenu(!showMoreMenu);
        setIsEditing(!isEditing);
    }
    return (
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0">{userInfo.profileAvatar}</div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="font-semibold text-gray-900">{userInfo.nickName}</span>
                            <span className="text-sm text-gray-500 ml-2">{comment.createdAt}</span>
                        </div>
                        <div>
                            <div className="relative">
                                
                            {(userId == comment.commentId || userRole==='admin') && (

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
                                        handleDeleteComment()
                                        setIsEditing(!isEditing)
                                    }}
                                />
                            )}
                            </div>
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="flex justify-end mt-2">
                            <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                rows={1}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                />
                            <button
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                onClick={() => {
                                    handleUpdateComment({ ...comment, content: editText });
                                    setIsEditing(!isEditing);
                                }}
                            >
                                <Send/>
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-3">{comment.content}</p>
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    <ThumbsUp size={14} />
                                    <span>{comment.likeCount}</span>
                                </button>
                                <button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    답글
                                </button>
                            </div>
                        </>
                    )}
                    
                </div>
            </div>
        </div>

    )
}

export default CommentItem