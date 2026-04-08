import { useNavigate } from "react-router";

interface ViewButtonProps {
    boardId:number,
    handleViewClick: () => void;
}

const ViewButton = ({
    boardId, 
    handleViewClick
}:ViewButtonProps) => {
    const communityPageUrl = import.meta.env.VITE_REACT_APP_URL_BOARD;
    const navigate = useNavigate();
    return (
        <button
            type="button" // 폼 제출 방지
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            onClick={(e)=>{
                e.preventDefault();
                handleViewClick();
                navigate(`${communityPageUrl}/${boardId}`);
            }}
        >
            자세히 보기 →
        </button>
    )
}

export default ViewButton