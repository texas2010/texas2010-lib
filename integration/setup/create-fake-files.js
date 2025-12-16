import fs from 'node:fs/promises';
import path from 'node:path';

const sharedCode = async () => {
  console.log('[Create Fake Files] Starting to make fake code...');

  const root = path.join(process.cwd(), 'build/shared');
  const fakeDir = path.join(root, 'fakeDir');

  // create folders
  console.log('[Create Fake Files] Creating Fake Folder...');
  await fs.mkdir(fakeDir, { recursive: true });

  // build/shared/fakeDir/index.js
  console.log('[Create Fake Files] Creating fake index.js file...');
  await fs.writeFile(
    path.join(fakeDir, 'index.js'),
    `const e = (r) => Number(r);
    export {
      e as random
    };
    `,
    'utf8'
  );

  // build/shared/fakeDir/index.d.ts
  console.log('[Create Fake Files] Creating fake index.d.ts file...');
  await fs.writeFile(
    path.join(fakeDir, 'index.d.ts'),
    `declare const random: (str: string) => number;
    export { random };
    `,
    'utf8'
  );
};

await sharedCode();
