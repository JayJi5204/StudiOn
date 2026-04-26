import { 
  ThumbsUp, 
  Share2 
} from 'lucide-react';
interface PostActionsProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
}

const PostActions = ({ isLiked, likeCount, onLike }: PostActionsProps) => {

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <div className="flex space-x-2">
        {/* 좋아요 */}
        <button
          onClick={onLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            isLiked
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label={isLiked ? '좋아요 취소' : '좋아요'}
        >
          <ThumbsUp size={18} />
          <span className="font-medium">{likeCount}</span>
        </button>

      </div>

      {/* 공유 */}
      <button
        onClick={handleShare}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Share2 size={18} />
        <span className="font-medium">공유</span>
      </button>
    </div>
  );
};

export default PostActions;