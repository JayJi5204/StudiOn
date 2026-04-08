import { useState } from 'react';
import type { IBoard } from '../../types/boards.type';
import {
    Eye,
    Target,
} from 'lucide-react';
import ViewButton from '../button/ViewButton';
import { postService } from '../../services/posts.service';

interface MyBoardsContentProps {
    userId: number;
    myBoards: IBoard[];
}

const MyBoardsContent = ({
    userId,
    myBoards,
}: MyBoardsContentProps) => {

    const _myBoards = myBoards.filter(myBoard => myBoard.userId === userId);
    const [localBoards, setLocalBoards] = useState<IBoard[]>(_myBoards);
    const [isView, setIsView] = useState(false);

    const handleViewClick = async (postId: number) => {
        try {
            await postService.updateViewCount(postId);
            setLocalBoards(prevBoards =>
                prevBoards.map(post =>
                    (!isView && post.boardId === postId)
                        ? { ...post, viewCount: post.viewCount + 1 }
                        : post
                )
            );
        } catch (error) {
            console.log("조회수 증가 에러");
            alert("조회수 증가 에러");
        }
    };

    return (
        <div className='space-y-4'>
            {localBoards.map((myBoard) => (
                <div key={myBoard.boardId} className='bg-white rounded-2xl shadow-lg p-5 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h4 className='text-lg font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer'>{myBoard.title}</h4>
                        <span className='text-xs text-gray-500'>{myBoard.createdAt}</span>
                    </div>
                    <div className='flex justify-between items-center space-x-4 text-sm text-gray-600'>
                        <div className='flex gap-2'>
                            <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                                {myBoard.category}
                            </span>
                            <span className='flex items-center'><Eye className='w-4 h-4 mr-1 text-gray-400' /> {myBoard.viewCount}</span>
                            <span className='flex items-center'><Target className='w-4 h-4 mr-1 text-red-400' /> {myBoard.likeCount}</span>
                        </div>

                        <ViewButton
                            boardId={myBoard.boardId}
                            handleViewClick={() => {
                                handleViewClick(myBoard.boardId);
                                setIsView(true);
                            }}
                        />
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

export default MyBoardsContent;
