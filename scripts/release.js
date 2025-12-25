import fs from 'node:fs';
import { execCommand } from '../utils/execCommand.js';

console.log('Running Release Script...');

/* get current git branch name */
const branchResult = execCommand('git branch --show-current');
if (!branchResult.ok) process.exit(1);

const currentBranch = branchResult.output.trim();

/* allow script to run only on expected base branches */
if (currentBranch !== 'fake-main-test' && currentBranch !== 'main') {
  console.error('You must be on the main branch');
  process.exit(1);
}

/* check for uncommitted changes */
const workingTreeResult = execCommand('git status --porcelain');
if (!workingTreeResult.ok) process.exit(1);

if (workingTreeResult.output.trim().length > 0) {
  console.error('Working tree is not clean');
  process.exit(1);
}

/* update local main branch */
if (currentBranch === 'main') {
  const pullResult = execCommand('git pull origin main');
  if (!pullResult.ok) process.exit(1);
}

/* create temporary release branch */
const checkoutTempResult = execCommand('git checkout -b release/tmp');
if (!checkoutTempResult.ok) process.exit(1);

/* show current branch */
execCommand('git branch --show-current');

/* run interactive changeset prompt */
execCommand('npx changeset', { stdio: 'inherit' });

/* apply changeset version updates */
const changesetVersionResult = execCommand('npx changeset version');
if (!changesetVersionResult.ok) process.exit(1);

/* read version from package.json */
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

/* rename temporary branch to versioned release branch */
const renameResult = execCommand(`git branch -m ${releaseBranch}`);
if (!renameResult.ok) process.exit(1);

/* check working tree state before commit */
const statusResult = execCommand('git status --porcelain');
if (!statusResult.ok) process.exit(1);

/* stage all changes */
const trackedResult = execCommand('git add .');
if (!trackedResult.ok) process.exit(1);

/* create release commit */
const commitResult = execCommand(`git commit -m "chore(release): v${version}"`);
if (!commitResult.ok) process.exit(1);

/* push release branch */
if (currentBranch === 'main') {
  const pushResult = execCommand(`git push -u origin ${releaseBranch}`);
  if (!pushResult.ok) process.exit(1);
}

/* switch back to base branch */
const checkoutMainResult = execCommand(`git checkout ${currentBranch}`);
if (!checkoutMainResult.ok) process.exit(1);

/* show current branch */
execCommand('git branch --show-current');

console.log(`Release branch created: ${releaseBranch}`);
console.log('Open a PR to prod');
