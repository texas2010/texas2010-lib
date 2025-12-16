import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { run } from '../helpers/run-helper.js';

const root = process.cwd();

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const backendProject = async () => {
  const backendDir = path.join(root, '../backend-project');
  console.log('[Install Package: Backend] Backend Project');
  ensureDir(backendDir);

  console.log('[Install Package: Backend] Installing...');
  run('npm install @texas2010/lib', { cwd: backendDir });

  console.log('[Install Package: Backend] Creating file...');
  const backendSrc = path.join(backendDir, 'src');
  await fsp.writeFile(
    path.join(backendSrc, 'fake-file.ts'),
    `import { random } from '@texas2010/lib/shared/fakeDir';
    const temp = random('12345');
    console.log(temp);
    `,
    'utf8'
  );

  console.log('[Install Package: Backend] Building...');
  run('npm run build:ts', { cwd: backendDir });

  console.log('[Install Package: Backend] Running...');
  const nodeResult = run('node dist/fake-file.js', { cwd: backendDir });
  if (!nodeResult.ok || !nodeResult.output.includes('12345')) process.exit(1);
};

const frontendProject = async () => {
  const frontendDir = path.join(root, '../frontend-project');

  console.log('[Install Package: Frontend] Frontend Project');
  ensureDir(frontendDir);

  console.log('[Install Package: Frontend] Installing...');
  run('npm install @texas2010/lib', { cwd: frontendDir });

  console.log('[Install Package: Frontend] Creating...');
  const frontendSrc = path.join(frontendDir, 'src');
  await fsp.writeFile(
    path.join(frontendSrc, 'fake-file.ssr.ts'),
    `import { random } from '@texas2010/lib/shared/fakeDir';
    console.log('[SSR TEST] result:', random('12345'));
    `,
    'utf8'
  );

  console.log('[Install Package: Frontend] Adding SSR to package script...');

  const packagePath = path.join(frontendDir, 'package.json');
  const packageData = JSON.parse(await fsp.readFile(packagePath, 'utf8'));

  packageData.scripts['build:ssr'] = 'vite build --ssr src/fake-file.ssr.ts';

  await fsp.writeFile(
    packagePath,
    JSON.stringify(packageData, null, 2) + '\n',
    'utf8'
  );

  console.log('[Install Package: Frontend] Building...');
  run('npm run build:ssr', { cwd: frontendDir });

  console.log('[Install Package: Frontend] Running...');
  const ssrResult = run('node dist/fake-file.ssr.js', {
    cwd: frontendDir,
  });
  if (!ssrResult.ok || !ssrResult.output.includes('12345')) process.exit(1);
};

await backendProject();
await frontendProject();
