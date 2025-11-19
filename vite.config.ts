import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const viteConfig = process.env.VITECONFIG ?? 'shared';

const entryMap: Record<string, string> = {
  shared: resolve(__dirname, 'src/shared/index.ts'),
  backend: resolve(__dirname, 'src/backend/index.ts'),
  frontend: resolve(__dirname, 'src/frontend/index.ts'),
  react: resolve(__dirname, 'src/frontend/react/index.ts'),
};

if (!entryMap[viteConfig]) {
  throw new Error(`Invalid VITECONFIG: "${viteConfig}"`);
}

export default defineConfig({
  plugins: [
    viteConfig === 'react' ? react() : null,
    dts({
      outDir: `build/${viteConfig}`,
      entryRoot: `src/${viteConfig}`,
      include: [`src/${viteConfig}`],
      insertTypesEntry: true,
      rollupTypes: viteConfig === 'shared' ? true : false,
    }),
  ].filter(Boolean),

  build: {
    emptyOutDir: false,
    lib: {
      entry: entryMap[viteConfig],
      name: '@texas2010/lib',
      formats: ['es'],
      fileName: () => `index.js`,
    },
    outDir: `build/${viteConfig}`,
    rollupOptions: {
      external:
        viteConfig === 'react'
          ? ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
          : [],
    },
  },
});
