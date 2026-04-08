import axios from 'axios';
import type { IBoard } from '../types/boards.type';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_REACT_APP_URL_BOARD;

export const postService = {
  createPost: async (
    authorId: string | number,
    postData: Partial<IBoard>
  ): Promise<IBoard> => {
    const response = await axios.post<IBoard>(`${API_URL}/post`,{
      ...postData,
      authorId:authorId,
    }
  );
    return response.data;
  },
  getPosts: async (
      params:{
        page?: string | number;
        size?: string | number;
      }
    ): Promise<IBoard[]> => {
      const response = await axios.get<IBoard[]>(`${API_URL}`,{
          params:params, // axios가 자동으로 ?userId=1&page=1... 형태로 변환
          headers: authHeader(),
      });
    
    return response.data;
  },

  getPostById: async ( 
    id: string | number 
  ): Promise<IBoard> => {
    
    const response = await axios.get<IBoard>(`${API_URL}/post/${id}`);

    return response.data
  },

  updatePost: async (
    id: string | number,
    postData:Partial<IBoard>
  ):Promise<IBoard> => {
    const response = await axios.patch<IBoard>(`${API_URL}/post/${id}`,postData);
    return response.data;
  },
  
  deletePost: async (
    id: string | number
  ): Promise<void> => {
    const response = await axios.delete(`${API_URL}/post/${id}`);
    return response.data;
  },

  updateViewCount: async (
    id: string | number
  ) => {
    const response = await axios.patch(`${API_URL}/post/${id}/views`);
    return response.data;
  }
};