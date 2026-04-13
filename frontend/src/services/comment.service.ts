import axios from "axios";
import type { IBoardComment } from "../types/Response/board.type";
import type { ICommentRequest } from "../types/Request/comment.type";
import type { ICommentResponse, IUpdateCommentResponse } from "../types/Response/comment.type";

// const API_URL = import.meta.env.VITE_REACT_APP_URL_BOARD

export const commentService = {
    createComment: async (
        commentData:ICommentRequest
    ):Promise<ICommentResponse>  => {
        const response = await axios.post(`http://localhost:8000/comment-service/api/comments/create`,
            commentData,
            {
                withCredentials:true
            }
        );
        return response.data;
    },
    
    getComments: async ({
        boardId,
        lastPath,
        pageSize,
    }: {
        boardId: string;
        lastPath?: string;
        pageSize: number;
    }): Promise<IBoardComment[]> => {
        const response = await axios.get(
            `http://localhost:8000/comment-service/api/comments/infinite-scroll`,
            {
                params: { boardId, lastPath, pageSize },
                withCredentials: true,
            }
        );
        return response.data.map((c: any) => ({
            commentId: c.commentId,
            userId: c.userId,
            nickName: c.nickName,
            content: c.content,
            commentPath: c.commentPath,
            parentPath: null,
            likeCount: c.likeCount,
            isDeleted: c.isDeleted,
            createdAt: c.createdAt,
            modifiedAt: c.modifiedAt,
        }));
    },

    updateComment: async (
        commentId:string,
        content: string,
    ):Promise<IUpdateCommentResponse> => {
        const response = await axios.put(`http://localhost:8000/comment-service/api/comments/update/${commentId}`,
            { content },
            {
                withCredentials:true
            }
        );
        return response.data;
    },
    
    deleteComment: async (
        commentId: string
    ):Promise<IBoardComment> => {
        const response = await axios.delete(`http://localhost:8000/comment-service/api/comments/delete/${commentId}`,{
            withCredentials:true
        });
        return response.data;
    },
    
    likeComment: async (
      commentId: string
    ) => {
      const response = await axios.post(`http://localhost:8000/comment-service/api/comments/like/${commentId}`,{
        commentId
        },{
        withCredentials:true
      });
      return response.data;
    },

    unlikeComment: async (
      commentId: string
    ) => {
      const response = await axios.delete(`http://localhost:8000/comment-service/api/comments/like/${commentId}`,{
        withCredentials:true
      });
      return response.data;
    }
}