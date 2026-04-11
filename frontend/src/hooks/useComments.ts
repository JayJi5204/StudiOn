import {useState, useEffect} from "react";
import { commentService } from "../services/comment.service";
import type { IComment } from "../types/boards.type";

interface useCommentProps {
    boardId: string;
}

interface useCommentReturn {
    comments: IComment[];
    setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
    isLoding: boolean;
}


export const useComments = ({
        boardId,
    }:useCommentProps
):useCommentReturn => {
    
    const [comments,setComments] = useState<IComment[]>([]);
    const [isLoding,setIsLoding] = useState<boolean>(false);

    useEffect(() => {
        
        const loadComments = async () => {
        
            try{
                const commentsData = await commentService.getComments(boardId);
                setComments(commentsData);
                setIsLoding(true);
            } catch (error) {
                console.log(error);
                setIsLoding(false);
            }
        }
        loadComments();
    }, []);

    return { comments, setComments, isLoding }
}