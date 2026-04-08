import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/posts.service';
import type { IBoard } from '../types/boards.type';

interface UsePostsReturn {
  boards: IBoard[];
  isLoading: boolean;
  setBoards: React.Dispatch<React.SetStateAction<IBoard[]>>;
}

interface PostQueryParams {
  page: number;
  size: number;
}

export const useBoards = (
  params: PostQueryParams,
  isLoggedIn: boolean,
): UsePostsReturn => {

  const [boards, setBoards] = useState<IBoard[]>([]);
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
        setIsLoading(true);
        const boardsData = await postService.getPosts(params);
        setBoards(boardsData);
      } catch (error) {
        console.error('❌ 게시글 로드 실패:', error);
        setIsLoading(false);
      }
    };
    loadBoards();
    
  }, [params.page,params.size]); // 실제 요청에 필요한 값만!
  return { boards, setBoards, isLoading };
};

