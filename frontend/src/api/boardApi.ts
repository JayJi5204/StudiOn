import api from "./axios";
import type {
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardListResponse,
  BoardDetail,
  BoardRanking,
  BoardCategory,
} from "../types/board.type";

export const boardApi = {
  getBoards: (
    page: number,
    size: number,
    category?: BoardCategory,
    keyword?: string,
  ) =>
    api.get<BoardListResponse>("/boards/list", {
      params: { page, size, boardCategory: category, keyword },
    }),

  getBoard: (boardId: string) => api.get<BoardDetail>(`/boards/get/${boardId}`),

  createBoard: (data: CreateBoardRequest) =>
    api.post<{ boardId: string }>("/boards/create", data),

  updateBoard: (boardId: string, data: UpdateBoardRequest) =>
    api.put(`/boards/update/${boardId}`, data),

  deleteBoard: (boardId: string) => api.delete(`/boards/delete/${boardId}`),

  likeBoard: (boardId: string) => api.post(`/boards/like/${boardId}`),

  unlikeBoard: (boardId: string) => api.delete(`/boards/like/${boardId}`),

  getViewRanking: () => api.get<BoardRanking[]>("/boards/ranking/view"),

  getLikeRanking: () => api.get<BoardRanking[]>("/boards/ranking/like"),

  forceDeleteBoard: (boardId: string) =>
    api.delete(`/boards/admin/force/${boardId}`),
};
