// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/main.js",
      name: "MyWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    minify: false, // 🚫 غیر فعال کردن minify
    rollupOptions: {
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
