import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/posts.service';
import type { IPost } from '../types/posts.type';

interface UsePostsReturn {
  posts: IPost[];
  isLoading: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

interface PostQueryParams {
  page: number;
  limit: number;
}

export const usePosts = (
  params: PostQueryParams,  
  isLoggedin: boolean,
): UsePostsReturn => {

  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedin) {
      alert('게시글은 로그인 후 이용 가능합니다.');
      navigate('/');
      return
    }

    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await postService.getPosts(params);
        setPosts(data);
      } catch (error) {
        console.error('❌ 게시글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
    
  }, [params.page,params.limit]); // 실제 요청에 필요한 값만!
  return { posts, setPosts, isLoading };
};

