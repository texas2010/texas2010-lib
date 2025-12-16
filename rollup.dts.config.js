import fs from 'node:fs';
import path from 'node:path';
import dts from 'rollup-plugin-dts';

import { entryPoints } from './config/entry-points.js';

const baseDir = 'build-types';

export default entryPoints.map((name) => ({
  input: `${baseDir}/${name}/index.d.ts`,
  output: {
    file: `build/${name}/index.d.ts`,
    format: 'es',
  },
  plugins: [dts()],
}));
