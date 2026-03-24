import axios from "axios";
import type { Comment } from "../types/posts.type";


const API_URL = import.meta.env.VITE_REACT_APP_URL_BOARD

export const commentService = {
    createComment: async (
        postId: string | number,
        commentData:Comment
    ):Promise<Comment>  => {
        const response = await axios.post<Comment>(`${API_URL}/posts/${postId}/comments`,
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
        commentData:Comment,
    ):Promise<Comment> => {
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
    ):Promise<Comment> => {
        const response = await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
        return response.data;
    }
}