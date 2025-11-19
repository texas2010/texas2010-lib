import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const viteConfig = process.env.VITECONFIG ?? 'common';

const entryMap: Record<string, string> = {
  index: resolve(__dirname, 'src/common/index.ts'),
  common: resolve(__dirname, 'src/common/index.ts'),
  react: resolve(__dirname, 'src/react/index.ts'),
};

if (!entryMap[viteConfig]) {
  throw new Error(`Invalid VITECONFIG: "${viteConfig}"`);
}

export default defineConfig({
  plugins: [
    viteConfig === 'react' ? react() : null,
    dts({
      outDir: viteConfig === 'index' ? 'build' : `build/${viteConfig}`,
      entryRoot: `src/${viteConfig}`,
      include: [`src/${viteConfig}`],
      insertTypesEntry: true,
      // rollupTypes: true,
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
    outDir: viteConfig === 'index' ? 'build' : `build/${viteConfig}`,
    rollupOptions: {
      external:
        viteConfig === 'react'
          ? ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
          : [],
    },
  },
});
