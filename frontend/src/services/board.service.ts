import axios from 'axios';
import type { IBoard } from '../types/boards.type';
import type { IBoardDetailResponse, IUpdateBoardResponse } from '../types/Response/board.type';
import type { IPage,IPageResponse } from '../types/Response/board.type';
import type { IUpdateBoardRequest } from '../types/Request/board.type';

const API_URL = import.meta.env.VITE_REACT_API_URL_BOARD;

export const boardService = {
  createBoard: async (
    postData: Partial<IBoard>
  ): Promise<IBoard> => {
    const response = await axios.post<IBoard>(`http://localhost:8000/board-service/api/boards/create`,{
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags
      },
      {
        withCredentials:true
      }
    );
    return response.data;
  },

  getBoards: async (
    page: number,
    size: number,
    category?: string
  ): Promise<IPage<IPageResponse>> => {
    const response = await axios.get<IPage<IPageResponse>>(
      `http://localhost:8000/board-service/api/boards`,
      {
        params: { page, size, category },
        withCredentials: true,             
      }
    );
    console.log("getBoard:",response.data);
    return response.data;
  },

  getBoardById: async ( 
    boardId: string 
  ): Promise<IBoardDetailResponse> => {
    
    const response = await axios.get<IBoardDetailResponse>(`http://localhost:8000/board-service/api/boards/get/${boardId}`,{
      withCredentials:true
    });
    console.log("getBoardById:",response.data);
    return response.data
  },

  updateBoard: async (
    boardId: string,
    boardData:IUpdateBoardRequest
  ):Promise<IUpdateBoardResponse> => {
    const response = await axios.put<IUpdateBoardResponse>(`http://localhost:8000/board-service/api/boards/update/${boardId}`,
      boardData,
      {
        withCredentials:true
      }
    );
    return response.data;
  },
  
  deleteBoard: async (
    boardId: string
  ): Promise<void> => {
    const response = await axios.delete(`${API_URL}/delete/${boardId}`);
    return response.data;
  },

  likeBoard: async (
    boardId: string
  ) => {
    const response = await axios.post(`http://localhost:8000/board-service/api/boards/like/${boardId}`,{
      boardId
      },{
      withCredentials:true
    });
    return response.data;
  },

  unlikeBoard: async (
    boardId: string
  ) => {
    const response = await axios.delete(`http://localhost:8000/board-service/api/boards/like/${boardId}`,{
      withCredentials:true
    });
    return response.data;
  }
};