import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 80,
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
    root: __dirname,
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
