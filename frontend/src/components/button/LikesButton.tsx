import { ThumbsUp } from "lucide-react"

interface LikesButtonProps {
    likes: number;
    handleLikeCount: () => void; // 부모가 넘겨줄 함수 타입
}

const LikesButton = ({ likes, handleLikeCount }: LikesButtonProps) => {
    
    return (
        <button
            type="button"
            className="flex items-center hover:text-indigo-600 transition-colors"
            onClick={(e) => {
                e.preventDefault();
                handleLikeCount();
            }}
        >
            <ThumbsUp size={12} className="mr-1" />
            {likes}
        </button>
    );
};

export default LikesButton