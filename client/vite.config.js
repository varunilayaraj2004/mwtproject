import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Allow access from outside the container
  },
  //base: "/AI-Powered-Mens-Fastion-Style-E-commerce/", // 👈 important for GitHub Pages
});
