import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@/public": "/public",
    },
  },
  build: {
    cssMinify: true,
    lib: {
      entry: "src/index.ts", // Entry point to your package
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
      insertTypesEntry: true, // Optional: Automatically inserts 'types' field in package.json
      outDir: "dist/types", // Output directory for type declarations
    }),
    analyzer(),
  ],
});
