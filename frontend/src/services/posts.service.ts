import axios from 'axios';
import type Post from '../types/posts.type';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL_COMMUNITY_BOARD;

export const postService = {
  createPost: async (
    postData:Partial<Post>,
    authorId:number
  ): Promise<Post> => {
    const response = await axios.post<Post>(API_URL,{
      ...postData,
      authorId:authorId,
    }
  );
    return response.data;
  },
  getPosts: async (
      params:{
        authorId?:number; 
        page?:number; 
        limit?:number
      }
    ): Promise<Post[]> => {

      const response = await axios.get<Post[]>(API_URL,{
          params // axios가 자동으로 ?userId=1&page=1... 형태로 변환
      });
    
    return response.data;
  },

  getPostById: async ( 
    id: string | Number 
  ): Promise<Post> => {
    
    const response = await axios.get<Post>(`${API_URL}/${id}`);

    return response.data
  },

  updatePost: async (
    id:number,data:Partial<Post>
  ):Promise<Post> => {
    const response = await axios.put<Post>(`${API_URL}/${id}`,data);
    return response.data;
  },
  
  deletePost: async (
    id:number
  ): Promise<void> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } 
};