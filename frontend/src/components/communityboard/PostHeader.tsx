import { Clock, MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { useMoreMenu } from '../../hooks/useMoreMenu';
import type { IBoardDetailResponse } from '../../types/Response/board.type';

interface PostHeaderProps {
  board: IBoardDetailResponse;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PostHeader = ({ board, isOwner, onEdit, onDelete }: PostHeaderProps) => {
  const { showMoreMenu, toggleMenu, closeMenu, menuRef } = useMoreMenu();

  const handleEdit = () => {
    closeMenu();
    onEdit();
  };

  const handleDelete = () => {
    closeMenu();
    onDelete();
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      {/* 카테고리 + 더보기 메뉴 */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full font-medium">
          {board.category}
        </span>

        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="더보기 메뉴"
            >
              <MoreVertical size={20} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                  onClick={handleEdit}
                >
                  <Edit size={16} />
                  <span>수정</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  <span>삭제</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700">
                  <Flag size={16} />
                  <span>신고</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 제목 */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {board.title}
      </h1>

      {/* 작성자 정보 - board에서 가져옴 */}
      <div className="flex items-center space-x-3">
        {/* <div className="text-3xl">{board.profileAvatar ?? '🧑'}</div> */}
        <div className="text-3xl">{'🧑'}</div>
        <div>
          <p className="font-semibold text-gray-900">{board.nickName}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {board.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;