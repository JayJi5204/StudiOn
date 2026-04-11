import React, { useState, useEffect } from "react";
import { postService } from "../services/posts.service";
import type { IGetBoardDetail } from "../types/Response/board.type";

interface UsePostReturn {
    board: IGetBoardDetail | null;
    setBoard: React.Dispatch<React.SetStateAction<IGetBoardDetail | null>>;
    isLoading: boolean;
}

export const usePost = (
    id: string
): UsePostReturn => {
    const [board, setBoard] = useState<IGetBoardDetail | null>(null);  // ✅ null로 초기화
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const data = await postService.getPostById(String(id));
                setBoard(data);
                setIsLoading(true);
            } catch (error) {
                console.log(error);
            }
        }
        loadBoard();
    }, [id]);

    return { board, setBoard, isLoading };
}