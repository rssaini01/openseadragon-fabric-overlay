import { defineConfig } from "vite";
import path from 'path';

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname),
  base: mode === "prod" ? "/openseadragon-fabric-overlay" : "/",
  resolve: {
    alias: {
      "openseadragon-fabric-overlay":
        mode === "prod"
          ? path.resolve(__dirname, "../dist/fabric-overlay.js")
          : path.resolve(__dirname, "../src/fabric-overlay.ts"),
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  }
}));
