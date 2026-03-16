import axios from "axios";
import type { Comment } from "../types/posts.type";

const API_URL = import.meta.env.VITE_REACT_APP_URL_COMMUNITY_BOARD

export const commentService = {
    createComment: async (
        postId:number,
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
    getComments: async (postId:number) => {
        const response = await axios.get(`/post/${postId}/comments`);
        return response.data;
    },

    updateComment: async (
        postId:number,
        commentData:Comment,
    ):Promise<Comment> => {
        const response = await axios.put(`${API_URL}/posts/${postId}/comments`,
            {
                ...commentData,
            }
        );
        return response.data;
    },
    
    delteComment: async (commentId:number) => {
        await axios.delete(`/comments/${commentId}`);
    }
}