import path from 'path';
import { defineConfig, ViteUserConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const kind = process.env.TEST_KIND ?? 'unit';

const browserUnitConfig = {
  environment: 'jsdom',
} as const;

type BrowserModeConfig = Pick<NonNullable<ViteUserConfig['test']>, 'browser'>;

const browserModeConfig: BrowserModeConfig = {
  browser: {
    provider: playwright(),
    enabled: true,
    headless: true,
    instances: [
      {
        browser: 'chromium',
      },
      {
        browser: 'webkit',
      },
    ],
  },
};

const browserConfig =
  kind === 'integration' ? browserModeConfig : browserUnitConfig;

const projectsConfig = [
  {
    // Backend and shared
    test: {
      name: `node.${kind}`,
      environment: 'node',
      include: [
        `src/backend/**/*.${kind}.test.ts`,
        `src/shared/**/*.${kind}.test.ts`,
        kind === 'integration' ? `integration/tests/**/*.${kind}.test.ts` : '',
      ].filter((item) => item !== ''),
    },
  },
  {
    // Frontend
    test: {
      ...browserConfig,
      name: `browser.${kind}`,
      include: [
        `src/frontend/**/*.${kind}.test.ts`,
        `src/shared/**/*.${kind}.test.ts`,
      ],
    },
  },
];

export default defineConfig({
  test: {
    projects: projectsConfig,
    reporters: process.env.GITHUB_ACTIONS
      ? ['tree', 'github-actions']
      : ['tree'],
    exclude: ['node_modules', 'build'],
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
