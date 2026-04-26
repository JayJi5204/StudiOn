import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { useBoard } from '../hooks/useBoard';
import { boardService } from '../services/board.service';
import useUserInfoStore from '../store/userInfoStore';
import { dateFormatter } from '../utils/date';

import CommentSection from '../components/communityboard/CommentSection';
import PostHeader from '../components/communityboard/PostHeader'
import PostContent from '../components/communityboard/PostContent';
import PostActions from '../components/communityboard/PostActions';
import AuthorSidebar from '../components/communityboard/AuthorSidebar';

const BoardDetailPage = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const navigate = useNavigate();
  const { id } = useParams();

  const { board, isLoading } = useBoard(String(id));

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (board) {
      setIsLiked(board.isLiked);
      setLikeCount(board.likeCount);
    }
  }, [board]);

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isOwner =
    userInfo.role === 'admin' || userInfo.userId === board.userId;

  const handleEdit = () => {
    const updateBoardPageUrl = import.meta.env.VITE_REACT_APP_URL_WRITE_POST;
    navigate(`${updateBoardPageUrl}/${id}`, {
      state: {
        boardId: board.boardId,
        title: board.title,
        content: board.content,
        category: board.category,
        modifiedAt: dateFormatter(),
        tags: board.tags ?? [],
      },
    });
  };

  const handleDelete = async () => {
    const boardId = String(board.boardId);
    try {
      await boardService.deleteBoard(boardId);
      alert('삭제되었습니다.');
      navigate(-1);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await boardService.unlikeBoard(board.boardId);
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await boardService.likeBoard(board.boardId);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">목록으로</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <PostHeader
                board={board}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <PostContent
                content={board.content}
                tags={Array.isArray(board.tags) ? board.tags : []}
              />
              <PostActions
                isLiked={isLiked}
                likeCount={likeCount}
                onLike={handleLike}
              />
            </article>

            <CommentSection board={board} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AuthorSidebar
              userId={String(board.userId)}
              currentBoardId={String(board.boardId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
