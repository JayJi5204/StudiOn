import { ThumbsUp } from "lucide-react"

interface LikesButtonProps {
    likeCount: number;
    handleLikeCount: () => void;
}

const LikesButton = ({ 
    likeCount, 
    handleLikeCount }: LikesButtonProps) => {
    
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
            {likeCount}
        </button>
    );
};

export default LikesButton