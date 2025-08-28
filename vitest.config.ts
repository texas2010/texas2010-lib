import { defineConfig } from 'vitest/config';

const kind = process.env.TEST_KIND ?? 'unit';

export default defineConfig({
  test: {
    include:
      kind === 'integration'
        ? [
            'src/**/*.integration.test.ts',
            'integration/**/*.integration.test.ts',
          ]
        : ['src/**/*.unit.test.ts'],
    exclude: ['node_modules', 'build'],
    environment: 'node',
  },
});
