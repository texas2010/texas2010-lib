import { execSync } from 'node:child_process';

export function execCommand(cmd, opts = {}) {
  try {
    const output = execSync(cmd, {
      stdio: 'pipe',
      encoding: 'utf-8',
      ...opts,
    });

    // Always echo output so your logs are not blind
    console.log(output);

    return { ok: true, output };
  } catch (err) {
    const stderr = err.stdout?.toString() || err.message;
    console.error(stderr);

    return { ok: false, output: stderr };
  }
}
