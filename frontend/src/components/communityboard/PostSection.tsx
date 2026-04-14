import { useState } from "react"
import type { IPageResponse } from "../../types/Response/board.type"
import LikesButton from "../button/LikesButton"
import ViewButton from "../button/ViewButton"
import {
    Clock,
    Bookmark,
    Share2,
    Eye,
 } from "lucide-react"
import useUserInfoStore from "../../store/userInfoStore"
import { postService } from "../../services/posts.service"

interface PostsSectionProps {
    boards: IPageResponse[];
    setBoards: React.Dispatch<React.SetStateAction<IPageResponse[]>>;
}

const PostSection = ({
    boards,
    setBoards,
}:PostsSectionProps
) => {
    const userInfo = useUserInfoStore((state) => state.userInfo);

    const [isView,setIsView] = useState(false);
    const [likedBoards, setLikedBoards] = useState<Set<string>>(new Set());

    const handleLikeClick = async (boardId:string) => {

        try{
            const isLiked = likedBoards.has(boardId);
            
            setLikedBoards(prev => {
                const next = new Set(prev);
                isLiked ? next.delete(boardId) : next.add(boardId);
                return next;
            });
            
            setBoards(prevBoards => 
                prevBoards.map(board => 
                    (String(board.boardId) === boardId) 
                        ? {...board, likeCount: isLiked ? board.likeCount - 1 : board.likeCount + 1}
                        : board
                )
            );
            
            const response = isLiked ? await postService.unlikeBoard(boardId) : await postService.likeBoard(boardId);
            console.log('게시글 좋아요 완료', response);
            
        } catch (error) {
            console.log("좋아요 에러")
            alert("좋아요 에러")
        }
    }

    const handleViewClick = async (boardId:number) => {
        try {
            setBoards(prevBoards =>
                prevBoards.map(board => 
                    (!isView && board.boardId === boardId) 
                        ? { ...board, views: board.viewCount + 1 }
                        : board
                )
            );
            
        } catch (error) {
            console.log("조회수 증가 에러")
            alert("조회수 증가 에러")
        }
    }

    return (
        <>
            {boards.map((post) => (
                <div key={post.boardId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
                    <div className="space-y-4">
                        {/* Post Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">{userInfo.profileAvatar}</div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-gray-900">{userInfo.nickName}</span>
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Clock size={14} className="mr-1" />
                                            {post.createdAt}
                                        </div>
                                    </div>
                                </div>
                            <div className="flex space-x-2">
                                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <Bookmark size={20} />
                                </button>
                                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                        {/* Post Content */}
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-2">
                                {post.content}
                            </p>
                        </div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 justify-between">
                            <div className="space-x-1">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Post Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Eye size={16} />
                                        <span>{post.viewCount}</span>
                                    </div>
                                    <LikesButton
                                        likeCount={post.likeCount}
                                        handleLikeCount={()=>{
                                            handleLikeClick(String(post.boardId));
                                        }}
                                    />
                                </div>

                                <ViewButton
                                    boardId={String(post.boardId)}
                                    handleViewClick={() => {
                                        handleViewClick(post.boardId);
                                        setIsView(true);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    )
}



export default PostSection;