import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/posts.service';
import type Post from '../types/posts.type';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

interface PostQueryParams {
  page: number;
  limit: number;
  authorId?: number;
}

interface UsePostsOptions {
  userloggedIn?: boolean, 
  redirectUrl?: string,
  requireAuth: boolean; // 인증 체크 여부 선택
}

export const usePosts = (
  params: PostQueryParams = {page:1,limit:10},  
  options: UsePostsOptions
): UsePostsReturn => {

  const { userloggedIn, redirectUrl, requireAuth} = options;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 인증 체크
    if (requireAuth && !userloggedIn && redirectUrl) {
      alert('게시글은 로그인 후 이용 가능합니다.');
      navigate(redirectUrl);
      return;
    }

    // 2. 데이터 로드
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
    // params 객체의 변화를 감지하기 위해 JSON 문자열화하여 의존성 주입하거나, 
    // 주요 값들을 개별적으로 주입
  }, [userloggedIn, navigate, redirectUrl, requireAuth, params.authorId, params.page]); // 의존성 배열 관리

  return { posts, setPosts, isLoading };
};