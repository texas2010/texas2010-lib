import path from 'path';
import { defineConfig } from 'vitest/config';

const kind = process.env.TEST_KIND ?? 'unit';

export default defineConfig({
  test: {
    reporters: process.env.CI ? ['github-actions'] : ['tree'],
    include:
      kind === 'integration'
        ? [
            'src/**/*.integration.test.ts',
            'integration/**/*.integration.test.ts',
          ]
        : ['src/**/*.unit.test.ts'],
    exclude: ['node_modules', 'build'],
    environment: 'node',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
