import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { boardService } from '../../services/board.service';
import type { IPageResponse } from '../../types/Response/board.type';

interface AuthorSidebarProps {
  userId: string;
  currentBoardId: string;
}

const AuthorSidebar = ({ userId, currentBoardId }: AuthorSidebarProps) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchAuthorPosts = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const boards = await boardService.getBoardsByUser(userId);
        const filtered = boards
          .filter(post => String(post.boardId) !== currentBoardId)
          .slice(0, 4);
        setPosts(filtered);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorPosts();
  }, [userId, currentBoardId]);

  const handlePostClick = (boardId: string) => {
    const detailUrl = import.meta.env.VITE_REACT_APP_URL_BOARD_DETAIL;
    navigate(`${detailUrl}/${boardId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">작성자의 다른 글</h3>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-gray-400">글 목록을 불러오지 못했습니다.</p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p className="text-sm text-gray-400">다른 글이 없습니다.</p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.boardId}
              className={index < posts.length - 1 ? 'pb-4 border-b border-gray-100' : ''}
            >
              <h4
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mb-2 transition-colors"
                onClick={() => handlePostClick(String(post.boardId))}
              >
                {post.title}
              </h4>
              <p className="text-xs text-gray-500">{post.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorSidebar;