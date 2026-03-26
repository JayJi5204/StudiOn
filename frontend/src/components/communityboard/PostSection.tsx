import { useState } from "react"
import type { IPost } from "../../types/posts.type"
import LikesButton from "../button/LikesButton"
import ViewButton from "../button/ViewButton"
import {
    Clock,
    Bookmark,
    Share2,
    Eye,
    MessageCircle,
 } from "lucide-react"
import { postService } from "../../services/posts.service"
 
interface PostsSectionProps{
    posts:IPost[];
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const PostSection = ({
    posts,
    setPosts
}:PostsSectionProps) => {
    const [isLike,setIsLike] = useState(false);
    const [isView,setIsView] = useState(false);
    
    const handleLikeClick = (postId:number) => {
        setPosts(prevPosts => 
            prevPosts.map(post => 
                (isLike && post.id === postId) 
                    ? { ...post, likes: post.likes - 1 } 
                    : { ...post, likes: post.likes + 1 }
            )
        );
    }

    const handleViewClick = async (postId:number) => {
        try {
            await postService.updateViewCount(postId)
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    (!isView && post.id === postId) 
                        ? { ...post, views: post.views + 1 }
                        : post
                )
            );
            
        } catch (error) {
            console.log("조회수 증가 에러")
            alert("조회수 증가 에러")
        }
    }

    return (
        <>
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
                    <div className="space-y-4">
                        {/* Post Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">{post.authorAvatar}</div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-gray-900">{post.author}</span>
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
                                        <span>{post.views}</span>
                                    </div>
                                    <LikesButton
                                        likes={post.likes}
                                        handleLikeCount={()=>{
                                            handleLikeClick(post.id);
                                            setIsLike(!isLike);
                                        }}
                                    />
                                    <div className="flex items-center space-x-1">
                                        <MessageCircle size={16} />
                                        <span>{post.comments.length}</span>
                                    </div>
                                </div>

                                <ViewButton
                                    postId={post.id}
                                    handleViewClick={() => {
                                        handleViewClick(post.id);
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