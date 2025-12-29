import { defineConfig } from 'vitest/config';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      include: ['../src/**/*.ts'],
      exclude: ['../tests/**', '../site/**', '../dist/**'],
    },
    reporters: ['default', 'junit'],
    outputFile: '../test-report.junit.xml',
  },
  plugins: [
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "openseadragon-fabric-overlay",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
});
