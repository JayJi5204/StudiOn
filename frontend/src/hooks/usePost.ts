import React, { useState,useEffect } from "react";
import { postService } from "../services/posts.service";
import type { IPost } from '../types/posts.type';

interface UsePostReturn{
    post:IPost;
    setPost: React.Dispatch<React.SetStateAction<IPost>>;
    isLoading:boolean;
}

export const usePost = (
    id: string | number
): UsePostReturn => {
    const [post,setPost] = useState<IPost>({} as IPost);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadPost = async () => {
          try {
            const data = await postService.getPostById(id);
            
            setPost(data);
            setIsLoading(true);

          } catch (error){
              console.log(error)
          }
        }
        loadPost();
      },[id]);

    return {post,setPost,isLoading}
}