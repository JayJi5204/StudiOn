import axios from 'axios';
import type Post from '../types/posts.type';

const freebulletinboardUrl = import.meta.env.VITE_REACT_APP_API_URL_FREEBULLETINBOARD;

export const postService = {
  getPosts: async (): Promise<Post[]> => {
    const response = await axios.get<Post[]>(freebulletinboardUrl);
    return response.data;
  },
  createPost: async (postData:Partial<Post>): Promise<Post> => {
    const response = await axios.post<Post>(freebulletinboardUrl, postData);
    return response.data;
  },
};