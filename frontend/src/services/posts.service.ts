import axios from 'axios';
import type { IPosts, IPost } from '../types/posts.type';

const API_URL = import.meta.env.VITE_REACT_APP_URL_BOARD;

export const postService = {
  createPost: async (
    authorId: string | number,
    postData: Partial<IPost>
  ): Promise<IPost> => {
    const response = await axios.post<IPost>(`${API_URL}/post`,{
      ...postData,
      authorId:authorId,
    }
  );
    return response.data;
  },
  getPosts: async (
      params:{
        page?: string | number; 
        limit?: string | number
      }
    ): Promise<IPost[]> => {

      const response = await axios.get<IPosts>(`${API_URL}/posts`,{
          params // axios가 자동으로 ?userId=1&page=1... 형태로 변환
      });
    
    return response.data.posts;
  },

  getPostById: async ( 
    id: string | number 
  ): Promise<IPost> => {
    
    const response = await axios.get<IPost>(`${API_URL}/post/${id}`);

    return response.data
  },

  updatePost: async (
    id: string | number,
    postData:Partial<IPost>
  ):Promise<IPost> => {
    const response = await axios.patch<IPost>(`${API_URL}/post/${id}`,postData);
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