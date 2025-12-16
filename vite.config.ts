import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { entryPoints } from './config/entry-points.js';

const entryMap = Object.fromEntries(
  entryPoints.map((key) => [key, resolve(__dirname, `src/${key}/index.ts`)])
);

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    emptyOutDir: true,
    outDir: 'build',
    lib: {
      entry: entryMap,
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}/index.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  },
});
