import React, { useState,useEffect } from "react";
import { postService } from "../services/posts.service";
import type { IBoard } from '../types/boards.type';

interface UsePostReturn{
    board:IBoard;
    setBoard: React.Dispatch<React.SetStateAction<IBoard>>;
    isLoading:boolean;
}

export const usePost = (
    id: string | number
): UsePostReturn => {
    const [board,setBoard] = useState<IBoard>({} as IBoard);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadBoard = async () => {
          try {
            const data = await postService.getPostById(id);
            
            setBoard(data);
            setIsLoading(true);

          } catch (error){
              console.log(error)
          }
        }
        loadBoard();
      },[id]);

    return {board,setBoard,isLoading};
}