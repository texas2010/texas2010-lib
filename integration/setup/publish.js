import { execCommand } from '../../utils/execCommand.js';

console.log('[Publish] Setting registry...');
const setReg = execCommand('npm config set registry http://verdaccio:4873/');
if (!setReg.ok) process.exit(1);

console.log('[Publish] Setting fake auth token...');
const setAuth = execCommand(
  'npm config set //verdaccio:4873/:_authToken=faketoken'
);
if (!setAuth.ok) process.exit(1);

console.log('[Publish] Getting registry...');
const getReg = execCommand('npm config get registry');
if (!getReg.ok) process.exit(1);

const versionRes = execCommand('npm pkg get version --json');
if (!versionRes.ok) process.exit(1);
const version = JSON.parse(versionRes.output);

console.log('[Publish] Unpublishing package if it exists...');
execCommand(`npm unpublish @texas2010/lib@${version} --force || true`);

console.log('[Publish] Publishing package...');
const pub = execCommand('npm publish --ignore-scripts');
if (!pub.ok) process.exit(1);

console.log('[Publish] Publish successful.');
