import React, { useState, useEffect } from "react";
import { boardService } from "../services/board.service";
import type { IBoardDetailResponse } from "../types/Response/board.type";

interface UseBoardReturn {
    board: IBoardDetailResponse | null;
    setBoard: React.Dispatch<React.SetStateAction<IBoardDetailResponse | null>>;
    isLoading: boolean;
}

export const useBoard = (
    id: string
): UseBoardReturn => {
    const [board, setBoard] = useState<IBoardDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const data = await boardService.getBoardById(String(id));
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