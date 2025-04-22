import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@/public": "/public",
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"), // Entry point to your package
      name: "walkthrough",
      fileName: "walkthrough",
      formats: ["es", "cjs"], // Output ES and CommonJS formats
    },
    rollupOptions: {
      external: ["vue", "react"], // Any external dependencies you don’t want to bundle
      output: {
        globals: {
          vue: "Vue",
          react: "React",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "walkthrough.css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      include: ["src"],
    }),
    // analyzer({ openAnalyzer: false }),
  ],
});
