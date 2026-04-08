import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
      host: env.VITE_SERVER_HOST || "localhost",
      port: Number(env.VITE_SERVER_PORT) || 8167,
      proxy: {
        "/api/users": {
          target: "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/user-service/api/users"), // ^를 붙여 시작 부분임을 명시하는 것이 더 안전합니다.
        },
        "/api/boards": {
          target: "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/board-service/api/boards"), // ^를 붙여 시작 부분임을 명시하는 것이 더 안전합니다.
        },
      },
    },
    test: {
      globals: true,
      root: __dirname,
      setupFiles: ["./src/vitest.setup.ts"],
    },
  };
});
