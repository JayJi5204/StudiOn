import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/posts.service';
import type { IPageResponse } from '../types/Response/board.type';

interface PostQueryParams {
  page: number;
  size: number;
  category?: string;
}

export const useBoards = (
  params: PostQueryParams,
  isLoggedIn: boolean,
) => {

  const [boards, setBoards] = useState<IPageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      alert('게시글은 로그인 후 이용 가능합니다.');
      navigate('/');
      return
    }

    const loadBoards = async () => {

      try {
        const boardsData = await postService.getPosts(params.page, params.size);
        console.log(boardsData);
        setBoards(boardsData.content);
        setIsLoading(true);
      } catch (error) {
        console.error('❌ 게시글 로드 실패:', error);
        setIsLoading(false);
      }
    };
    loadBoards();
    
  }, [params.page,params.size]); // 실제 요청에 필요한 값만!
  return { boards, setBoards, isLoading };
};

