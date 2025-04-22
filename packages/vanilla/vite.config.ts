import { defineConfig } from "vite";

import dts from "vite-plugin-dts"; // This is for generating TypeScript declaration files

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@/public": "/public",
    },
  },
  build: {
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
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true, // Optional: Automatically inserts 'types' field in package.json
      outDir: "dist/types", // Output directory for type declarations
    }),
  ],
});
