// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  define: {
    "process.env": {},
  },
  build: {
    lib: {
      entry: "src/main.js",
      name: "MyWidget",
      fileName: "widget",
      formats: ["iife"],
    },
    minify: false,
    rollupOptions: {
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
