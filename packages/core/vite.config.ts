import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"), // Entry point to your package
      name: "ajala",
      fileName: "ajala",
      formats: ["es", "cjs"], // Output ES and CommonJS formats
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "ajala.css";
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
