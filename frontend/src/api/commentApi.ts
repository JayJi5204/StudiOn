import api from "./axios";
import type { UpdateCommentRequest } from "../types/comment.type";

export const commentApi = {
  getComments: (boardId: string) =>
    api.get(`/comments/getCommentWithBoardId/${boardId}`),

  getCommentsInfinite: (
    boardId: string,
    lastPath?: string,
    pageSize: number = 10,
  ) =>
    api.get(`/comments/infinite-scroll`, {
      params: { boardId, lastPath, pageSize },
    }),

  createComment: (data: {
    boardId: string;
    content: string;
    parentPath?: string;
  }) => api.post("/comments/create", data),

  updateComment: (commentId: string, data: UpdateCommentRequest) =>
    api.put(`/comments/update/${commentId}`, data),

  deleteComment: (commentId: string) =>
    api.delete(`/comments/delete/${commentId}`),

  likeComment: (commentId: string) => api.post(`/comments/like/${commentId}`),

  unlikeComment: (commentId: string) =>
    api.delete(`/comments/like/${commentId}`),

  forceDeleteComment: (commentId: string) =>
    api.delete(`/comments/admin/force/${commentId}`),
};
