import  { useState } from 'react';
import { postService } from '../../services/posts.service';
import {Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  postId: number;
  onDeleteSuccess: (id:number) => void;
}

const DeleteButton = ({postId,onDeleteSuccess}:DeleteButtonProps) => {

    const [isDeleting,setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

      try {
          setIsDeleting(true);
          await postService.deletePost(postId)
          alert('삭제되었습니다.');
          onDeleteSuccess(postId); // 부모 컴포넌트에서 목록을 갱신하게 함

      } catch (error){
          console.error('삭제 실패:', error);
          alert('삭제 중 오류가 발생했습니다.');
      } finally {
          setIsDeleting(false);
      }
    
    }
    return (
      <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-2 py-1 rounded-full bg-indigo-600 text-white text-sm cursor-pointer hover:bg-blue-400`}
      >
        <Trash2 className='w-5 h-5'>
          삭제
        </Trash2>
      </button>
    )
}

export default DeleteButton