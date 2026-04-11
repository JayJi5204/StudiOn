import axios from 'axios';
import type { IBoard } from '../types/boards.type';
import type { IGetBoardDetail } from '../types/Response/board.type';
import type { IPage,IGetPageResponse } from '../types/Response/board.type';

const API_URL = import.meta.env.VITE_REACT_API_URL_BOARD;

export const postService = {
  createPost: async (
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

  getPosts: async (
    page: number,
    size: number,
    category?: string
  ): Promise<IPage<IGetPageResponse>> => {
    const response = await axios.get<IPage<IGetPageResponse>>(
      `http://localhost:8000/board-service/api/boards`,
      {
        params: { page, size, category },
        withCredentials: true,             
      }
    );
    console.log(response.data);
    return response.data;
  },

  getPostById: async ( 
    boardId: string 
  ): Promise<IGetBoardDetail> => {
    
    const response = await axios.get<IGetBoardDetail>(`http://localhost:8000/board-service/api/boards/get/${boardId}`,{
      withCredentials:true
    });

    return response.data
  },

  updatePost: async (
    boardId: string | number,
    postData:Partial<IBoard>
  ):Promise<IBoard> => {
    const response = await axios.put<IBoard>(`${API_URL}/update/${boardId}`,postData);
    return response.data;
  },
  
  deletePost: async (
    boardId: string
  ): Promise<void> => {
    const response = await axios.delete(`${API_URL}/delete/${boardId}`);
    return response.data;
  },

  addLike: async (
    boardId: string
  ) => {
    const response = await axios.post(`http://localhost:8000/board-service/api/boards/like/${boardId}`,{
      boardId
      },{
      withCredentials:true
    });
    console.log(response.data);
    return response.data;
  },

  subLike: async (
    boardId: string
  ) => {
    const response = await axios.delete(`http://localhost:8000/board-service/api/boards/like/${boardId}`,{
      withCredentials:true
    });
    console.log(response.data);
    return response.data;
  }
};