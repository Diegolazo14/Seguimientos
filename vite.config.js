import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    },
  },
  plugins: [react()],
});
