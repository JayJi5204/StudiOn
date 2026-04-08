import axios from "axios";
import type { IComment } from "../types/boards.type";

const API_URL = import.meta.env.VITE_REACT_APP_URL_BOARD

export const commentService = {
    createComment: async (
        postId: string | number,
        commentData:IComment
    ):Promise<IComment>  => {
        const response = await axios.post<IComment>(`${API_URL}/posts/${postId}/comments`,
            {
                postId,
                ...commentData,
            }
        );
        return response.data;
    },
    getComments: async (postId: string | number) => {
        const response = await axios.get(`/post/${postId}/comments`);
        return response.data;
    },

    updateComment: async (
        postId:string | number,
        commentData:IComment,
    ):Promise<IComment> => {
        const response = await axios.put(`${API_URL}/posts/${postId}/comments`,
            {
                ...commentData,
            }
        );
        return response.data;
    },
    
    deleteComment: async (
        postId: string | number,
        commentId: string | number
    ):Promise<IComment> => {
        const response = await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
        return response.data;
    }
}