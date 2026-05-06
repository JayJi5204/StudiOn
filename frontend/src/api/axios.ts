import axios from "axios";
import useAuthStore from "../stores/authStore";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. 401 에러 처리 (기존 로직)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post("/api/users/reissue", {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        const publicPaths = [
          "/",
          "/board",
          "/study",
          "/ranking",
          "/signin",
          "/signup",
        ];
        const currentPath = window.location.pathname;
        const isPublic = publicPaths.some(
          (path) => currentPath === path || currentPath.startsWith(path + "/"),
        );
        if (!isPublic) {
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }
    }

    // 401 재시도 실패 상황이 아닐 때만 메시지를 띄웁니다.
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      alert(serverMessage);
    } else if (error.code === "ECONNABORTED") {
      alert("요청 시간이 초과되었습니다. 서버 상태를 확인해주세요.");
    }

    return Promise.reject(error);
  },
);

export default api;
