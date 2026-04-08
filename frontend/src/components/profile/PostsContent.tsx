import { Link } from 'react-router';
import type { IBoard, IComment} from '../../types/boards.type';
import {
    MessageSquare,
    Eye,
    Target,
} from 'lucide-react';
import useUserInfoStore from '../../store/userInfoStore';

interface PostsContentProps {
    myBoards:IBoard[],
    myComments:IComment[],
}

const PostsContent = ({
    myBoards,
    myComments,
}:PostsContentProps) => {
    const userInfo = useUserInfoStore((state) => state.userInfo);


    return (
        <div className='space-y-4'>
            {myBoards.map((post) => (
                <div key={post.boardId} className='bg-white rounded-2xl shadow-lg p-5 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h4 className='text-lg font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer'>{post.title}</h4>
                        <span className='text-xs text-gray-500'>{post.createdAt}</span>
                    </div>
                    <div className='flex justify-between items-center space-x-4 text-sm text-gray-600'>
                        <div className='flex gap-2'>
                            <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                                {post.category}
                            </span>
                            <span className='flex items-center'><Eye className='w-4 h-4 mr-1 text-gray-400'/> {post.viewCount}</span>
                            <span className='flex items-center'><Target className='w-4 h-4 mr-1 text-red-400'/> {post.likeCount}</span>
                            <span className='flex items-center'><MessageSquare className='w-4 h-4 mr-1 text-blue-400'/> {myComments.length}</span>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                            <Link to={`/profile/${userInfo.userId}/myBoards/${post.boardId}`}>자세히 보기 →</Link>
                        </button>
                    </div>
                </div>
            ))}
            <div className='text-center mt-6'>
                <button className='bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors'>
                    모든 작성글 보기
                </button>
            </div>
        </div>
    );
};

export default PostsContent