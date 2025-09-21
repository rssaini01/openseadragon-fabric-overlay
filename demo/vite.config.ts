import { defineConfig } from "vite";
import path from 'path';

export default defineConfig(({ mode }) => ({
  root: "./demo",
  base: mode === "prod" ? "/openseadragon-fabric/" : "/",
  resolve: {
    alias: {
      "openseadragon-fabric-overlay":
        mode === "prod"
          ? path.resolve(__dirname, "../dist/fabric-overlay.ts")
          : path.resolve(__dirname, "../src/fabric-overlay.ts"),
    }
  },
}));
