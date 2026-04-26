import axios from 'axios';
import type { IBoard } from '../types/boards.type';
import type { IBoardDetailResponse, IUpdateBoardResponse } from '../types/Response/board.type';
import type { IPage, IPageResponse } from '../types/Response/board.type';
import type { IUpdateBoardRequest } from '../types/Request/board.type';
import type { IUserDetailResponse } from '../types/Response/board.type';

const API_URL = import.meta.env.VITE_REACT_API_URL_BOARD;
const BASE_URL = 'http://localhost:8000/board-service/api/boards';
const USER_BASE_URL = 'http://localhost:8000/user-service/api/users';

export const boardService = {
  createBoard: async (
    postData: Partial<IBoard>
  ): Promise<IBoard> => {
    const response = await axios.post<IBoard>(`${BASE_URL}/create`, {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      tags: postData.tags,
    }, {
      withCredentials: true,
    });
    return response.data;
  },

  getBoards: async (
    page: number,
    size: number,
    category?: string
  ): Promise<IPage<IPageResponse>> => {
    const response = await axios.get<IPage<IPageResponse>>(`${BASE_URL}`, {
      params: { page, size, category },
      withCredentials: true,
    });
    return response.data;
  },

  getBoardById: async (
    boardId: string
  ): Promise<IBoardDetailResponse> => {
    const response = await axios.get<IBoardDetailResponse>(`${BASE_URL}/get/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  getBoardsByUser: async (
    userId: string
  ): Promise<IPageResponse[]> => {
    const response = await axios.get<IUserDetailResponse>(`${USER_BASE_URL}/${userId}`, {
      withCredentials: true,
    });
    return response.data.boards;
  },

  updateBoard: async (
    boardId: string,
    boardData: IUpdateBoardRequest
  ): Promise<IUpdateBoardResponse> => {
    const response = await axios.put<IUpdateBoardResponse>(
      `${BASE_URL}/update/${boardId}`,
      boardData,
      { withCredentials: true }
    );
    return response.data;
  },

  deleteBoard: async (
    boardId: string
  ): Promise<void> => {
    const response = await axios.delete(`${API_URL}/delete/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  likeBoard: async (
    boardId: string
  ) => {
    const response = await axios.post(`${BASE_URL}/like/${boardId}`, {
      boardId,
    }, {
      withCredentials: true,
    });
    return response.data;
  },

  unlikeBoard: async (
    boardId: string
  ) => {
    const response = await axios.delete(`${BASE_URL}/like/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};