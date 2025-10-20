import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/home/mahdi-kheibari/git-projects/New_Turing_Machine_Composition/src"
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
