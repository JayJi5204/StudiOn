import api from "./axios";
import type {
  SignupRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  MyInfo,
  StudyRanking,
  StudyDaily,
} from "../types/user.type";

export const userApi = {
  signup: (data: SignupRequest) => api.post("/users/create", data),

  login: (data: { email: string; password: string }) =>
    api.post<{
      userId: string;
      email: string;
      nickName: string;
      role: "USER" | "ADMIN";
      isLoggedIn: boolean;
    }>("/users/login", data),

  logout: () => api.post("/users/logout"),

  getMyInfo: () => api.get<MyInfo>("/users/my-info"),

  getUser: (userId: string) => api.get<MyInfo>(`/users/${userId}`),

  updateUser: (data: UpdateUserRequest) => api.put("/users/update", data),

  deleteUser: (data: DeleteUserRequest) =>
    api.delete("/users/delete", { data }),

  reissue: () => api.post("/users/reissue"),

  getStudyRanking: () => api.get<StudyRanking[]>("/users/ranking/study"),

  getMyRanking: () => api.get<number>("/users/ranking/study/my"),

  getStudyDaily: (days: number = 30) =>
    api.get<StudyDaily[]>("/users/study/daily", { params: { days } }),

  getAllUsers: () => api.get("/users/all-users"),

  forceDeleteUser: (userId: string) =>
    api.delete(`/users/admin/force/${userId}`),

  searchUsers: (keyword: string) =>
    api.get("/users/search", { params: { keyword } }),
};
