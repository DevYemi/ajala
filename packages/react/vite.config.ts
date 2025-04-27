import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"), // Entry point to your package
      name: "react-ajala",
      fileName: "react-ajala",
      formats: ["es", "cjs"], // Output ES and CommonJS formats
    },
    rollupOptions: {
      // Externalize React and ReactDOM
      external: ["react", "react-dom"],
    },
  },
  plugins: [react()],
});
