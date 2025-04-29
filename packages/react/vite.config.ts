import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
// import { analyzer } from "vite-bundle-analyzer";

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
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      rollupTypes: true,
      include: ["src"],
      outDir: "dist",
    }),
    // analyzer({ openAnalyzer: false }),
  ],
});
