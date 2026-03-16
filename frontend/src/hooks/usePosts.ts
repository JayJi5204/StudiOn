import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/posts.service';
import type { Post } from '../types/posts.type';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

interface PostQueryParams {
  page: number;
  limit: number;
}

export const usePosts = (
  params: PostQueryParams,  
  userloggedIn: boolean,
): UsePostsReturn => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //데이터 로드 (파라미터 변경 시에만 실행)
  useEffect(() => {
    if (!userloggedIn) {
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

