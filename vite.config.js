import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  cacheDir: ".vite-cache",
  plugins: [react()],
  server: {
    proxy: {
      "/api/overpass": {
        target: "https://overpass-api.de",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/api/interpreter",
      },
    },
  },
});
