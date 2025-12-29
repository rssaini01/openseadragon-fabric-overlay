import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    root: '..',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      reportsDirectory: './tests/coverage'
    },
    reporters: ['default', 'junit'],
    outputFile: 'test-results.xml',
  },
  plugins: [
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "osd-fabric-overlay",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ]
});
