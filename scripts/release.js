import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { execCommand } from '../utils/execCommand.js';

const checkChangesets = async () => {
  const dir = path.resolve('.changeset');

  let files;
  try {
    files = await fsp.readdir(dir);
  } catch {
    console.error('.changeset directory is missing');
    process.exit(1);
  }

  const changesetFiles = files
    .filter((name) => name.endsWith('.md'))
    .filter((name) => name.toLowerCase() !== 'readme.md')
    .sort();

  if (changesetFiles.length === 0) {
    console.error(
      'No unreleased changesets found. Run `npm run changeset` first.'
    );
    // process.exit(1);
  }

  console.log('Found changeset files:');
  for (const name of changesetFiles) {
    console.log(`- ${name}`);
  }
};

console.log('Checking git state...');

/* 1. ensure on main */
const branchResult = execCommand('git branch --show-current');
if (!branchResult.ok) process.exit(1);

const branch = branchResult.output.trim();
if (branch !== 'main' || branch !== 'fake-main-test') {
  console.error('You must be on the main branch');
  process.exit(1);
}

/* 2. ensure clean working tree */
const statusResult = execCommand('git status --porcelain');
if (!statusResult.ok) process.exit(1);

if (statusResult.output.trim().length > 0) {
  console.error('Working tree is not clean');
  process.exit(1);
}

/* 5. pull main */
const pullResult = execCommand('git pull origin main');
if (!pullResult.ok) process.exit(1);

/* 6. create temp release branch */
const checkoutResult = execCommand('git checkout -b release/tmp');
if (!checkoutResult.ok) process.exit(1);

//

/* 3. ensure release intent exists */
// await checkChangesets();

/* 4. show changeset status (informational only) */
const changesetStatusResult = execCommand('npx changeset status --verbose');
if (!changesetStatusResult.ok) {
  console.error(
    'No unreleased changesets found. Run `npm run changeset` first.'
  );
  process.exit(1);
}

/* 7. run changeset version */
const changesetResult = execCommand('npx changeset version');
if (!changesetResult.ok) process.exit(1);

/* 8. read version */
let version;
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  version = String(pkg.version || '').trim();
} catch {
  console.error('Failed to read package.json');
  process.exit(1);
}

if (!version) {
  console.error('package.json version is missing');
  process.exit(1);
}

const releaseBranch = `release/${version}`;

/* 9. rename branch */
const renameResult = execCommand(`git branch -m ${releaseBranch}`);
if (!renameResult.ok) process.exit(1);

/* 10. push branch */
const pushResult = execCommand(`git push origin ${releaseBranch}`);
if (!pushResult.ok) process.exit(1);

console.log(`Release branch created: ${releaseBranch}`);
console.log('Open a PR to prod');
