import axios from 'axios';
import type { IBoard } from '../types/boards.type';
import type { IBoardDetailResponse, IUpdateBoardResponse } from '../types/Response/board.type';
import type { IPage, IPageResponse } from '../types/Response/board.type';
import type { IUpdateBoardRequest } from '../types/Request/board.type';
import type { IUserDetailResponse } from '../types/Response/board.type';

const BASE_API_URL = import.meta.env.VITE_REACT_APP_API_URL_BOARD;
const USER_API_URL = import.meta.env.VITE_REACT_APP_API_URL_USERS;

export const boardService = {
  createBoard: async (
    postData: Partial<IBoard>
  ): Promise<IBoard> => {
    const response = await axios.post<IBoard>(`${BASE_API_URL}/create`, {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      tags: postData.tags,
    }, 
    {
      withCredentials: true,
    });
    return response.data;
  },

  getBoards: async (
    page: number,
    size: number,
    category?: string
  ): Promise<IPage<IPageResponse>> => {
    const response = await axios.get<IPage<IPageResponse>>(`${BASE_API_URL}/list`, {
      params: { page, size, category },
      withCredentials: true,
    });
    return response.data;
  },

  getBoardById: async (
    boardId: string
  ): Promise<IBoardDetailResponse> => {
    const response = await axios.get<IBoardDetailResponse>(`${BASE_API_URL}/get/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  getBoardsByUser: async (
    userId: string
  ): Promise<IPageResponse[]> => {
    const response = await axios.get<IUserDetailResponse>(`${USER_API_URL}/${userId}`, {
      withCredentials: true,
    });
    return response.data.boards;
  },

  updateBoard: async (
    boardId: string,
    boardData: IUpdateBoardRequest
  ): Promise<IUpdateBoardResponse> => {
    const response = await axios.put<IUpdateBoardResponse>(
      `${BASE_API_URL}/update/${boardId}`,
      boardData,
      { withCredentials: true }
    );
    return response.data;
  },

  deleteBoard: async (
    boardId: string
  ): Promise<void> => {
    const response = await axios.delete(`${BASE_API_URL}/delete/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  likeBoard: async (
    boardId: string
  ) => {
    const response = await axios.post(`${BASE_API_URL}/like/${boardId}`, {
      boardId,
    }, {
      withCredentials: true,
    });
    return response.data;
  },

  unlikeBoard: async (
    boardId: string
  ) => {
    const response = await axios.delete(`${BASE_API_URL}/like/${boardId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};