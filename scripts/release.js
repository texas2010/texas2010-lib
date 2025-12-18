import fs from 'node:fs';
import { execCommand } from '../utils/execCommand.js';

console.log('Checking git state...');

/* 1. ensure on main */
const branchResult = execCommand('git branch --show-current');
if (!branchResult.ok) process.exit(1);

const branch = branchResult.output.trim();
if (branch !== 'main') {
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

/* 3. ensure unreleased changesets exist */
const changesetStatusResult = execCommand('npx changeset status --verbose', {
  stdio: 'inherit',
});
if (!changesetStatusResult.ok) {
  console.error('No unreleased changesets found. Run `npx changeset` first.');
  process.exit(1);
}

/* 4. pull main */
const pullResult = execCommand('git pull origin main', { stdio: 'inherit' });
if (!pullResult.ok) process.exit(1);

/* 5. create temp release branch */
const checkoutResult = execCommand('git checkout -b release/tmp', {
  stdio: 'inherit',
});
if (!checkoutResult.ok) process.exit(1);

/* 6. run changeset version */
const changesetResult = execCommand('npx changeset version', {
  stdio: 'inherit',
});
if (!changesetResult.ok) process.exit(1);

/* 7. read version */
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

/* 8. rename branch */
const renameResult = execCommand(`git branch -m ${releaseBranch}`, {
  stdio: 'inherit',
});
if (!renameResult.ok) process.exit(1);

/* 9. push branch */
const pushResult = execCommand(`git push origin ${releaseBranch}`, {
  stdio: 'inherit',
});
if (!pushResult.ok) process.exit(1);

console.log(`Release branch created: ${releaseBranch}`);
console.log('Open a PR to prod');
