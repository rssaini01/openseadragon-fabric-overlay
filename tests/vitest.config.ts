import { defineConfig } from 'vitest/config';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
    },
    reporters: ['default', 'junit'],
    outputFile: '../test-results.xml',
  },
  plugins: [
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "openseadragon-fabric-overlay",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
});
