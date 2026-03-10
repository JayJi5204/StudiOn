import React, { useState,useEffect } from "react";
import { postService } from "../services/posts.service";
import type { Post } from '../types/posts.type';

interface UsePostReturn{
    post:Post;
    setPost: React.Dispatch<React.SetStateAction<Post>>;
    isLoading:boolean;
}

export const usePost = (
    id:number
): UsePostReturn => {
    const [post,setPost] = useState<Post>({} as Post);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadPost = async () => {
          try {
            const data = await postService.getPostById(Number(id));
            
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