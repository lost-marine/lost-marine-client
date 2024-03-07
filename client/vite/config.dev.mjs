import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@game", replacement: "/src/game" },
      { find: "@components", replacement: "/src/game/components" },
      { find: "@public", replacement: "/public" }
    ]
  },
  server: {
    host: "0.0.0.0",
    port: 8080
  }
});
