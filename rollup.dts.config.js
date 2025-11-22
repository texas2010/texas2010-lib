import fs from 'node:fs';
import path from 'node:path';
import dts from 'rollup-plugin-dts';

// scan /build and find every folder that contains index.d.ts
const baseDir = 'build';

const entries = fs.readdirSync(baseDir).flatMap((dir) => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.statSync(fullPath).isDirectory()) return [];

  const results = [];

  // if folder has index.d.ts
  const indexPath = path.join(fullPath, 'index.d.ts');
  if (fs.existsSync(indexPath)) {
    results.push(dir);
  }

  // check subfolders
  const subfolders = fs
    .readdirSync(fullPath)
    .filter((sub) => fs.existsSync(path.join(fullPath, sub, 'index.d.ts')))
    .map((sub) => `${dir}/${sub}`);

  results.push(...subfolders);

  return results;
});

export default entries.map((name) => ({
  input: `build/${name}/index.d.ts`,
  output: {
    file: `build/${name}/index.d.ts`,
    format: 'es',
  },
  plugins: [dts()],
}));
