import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useBoard } from "../hooks/useBoard";
import { useBoards } from "../hooks/useBoards";
import { boardService } from "../services/board.service";
import useUserInfoStore from "../store/userInfoStore";
import CommentSection from "../components/communityboard/CommentSection";
import { dateFormatter } from "../utils/date";
import {
  ArrowLeft,
  ThumbsUp,
  Clock,
  Bookmark,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
} from "lucide-react";

const BoardDetailPage = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const navigate = useNavigate();
  const { id } = useParams();
  const { board, isLoading } = useBoard(String(id));
  const { setBoards } = useBoards(
    { page: 1, size: 10 },
    Boolean(userInfo.isLoggedIn),
  );

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    if (board) {
      setIsLiked(board.isLiked);
      setLikeCount(board.likeCount);
    }
  }, [board]);

  const handleEdit = () => {
    const updateBoardPageUrl = import.meta.env.VITE_REACT_APP_URL_WRITE_POST;
    navigate(`${updateBoardPageUrl}/${id}`, {
      state: {
        boardId: board?.boardId || "",
        title: board?.title || "",
        content: board?.content || "",
        category: board?.category || "",
        modifiedAt: dateFormatter() || "",
        tags: board?.tags || [],
      },
    });
  };

  const handleDelete = async (deletedId: string) => {
    //삭제할 포스트를 제외하고 목록을 새로 고침
    try {
      await boardService.deleteBoard(deletedId);
      setBoards((prevBoards) =>
        prevBoards.filter((board) => String(board.boardId) !== deletedId),
      );
      alert("삭제되었습니다.");
      navigate(-1);
    } catch {
      alert("삭제에 실패했습니다.");
      navigate("/");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    if (!board) return;

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
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    alert("링크가 클립보드에 복사되었습니다!");
  };

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
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
            onClick={handleBack}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
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
              {/* Post Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full font-medium">
                    {board.category}
                  </span>
                  <div className="relative">
                    {(userInfo.role === "admin" ||
                      userInfo.userId === board.userId) && (
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                    )}
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
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                          onClick={() => {
                            handleDelete(board.boardId);
                          }}
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
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {board.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{userInfo.profileAvatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {userInfo.nickName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {board.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="prose max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {board.content}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.isArray(board.tags) &&
                  board.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isLiked
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span className="font-medium">{likeCount}</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition-all ${
                      isBookmarked
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Bookmark
                      size={18}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} />
                  <span className="font-medium">공유</span>
                </button>
              </div>
            </article>
            <CommentSection board={board} />
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                작성자의 다른 글
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mb-2">
                    JavaScript 비동기 처리 완전 정복
                  </h4>
                  <p className="text-xs text-gray-500">2024-10-15</p>
                </div>
                <div className="pb-4 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mb-2">
                    CSS Grid 레이아웃 실전 예제
                  </h4>
                  <p className="text-xs text-gray-500">2024-10-10</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2 mb-2">
                    개발자 커리어 로드맵 정리
                  </h4>
                  <p className="text-xs text-gray-500">2024-10-05</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
