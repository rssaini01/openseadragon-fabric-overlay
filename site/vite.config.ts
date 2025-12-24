import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  base: mode === "prod" ? "/openseadragon-fabric-overlay" : "/",
  resolve: {
    alias: {
      "openseadragon-fabric-overlay":
        mode === "prod"
          ? path.resolve(__dirname, "../dist/esm/fabric-overlay.js")
          : path.resolve(__dirname, "../src/fabric-overlay.ts"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
