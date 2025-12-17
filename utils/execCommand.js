import { execSync } from 'node:child_process';

export function execCommand(cmd, opts = {}) {
  try {
    const output = execSync(cmd, {
      stdio: 'pipe',
      encoding: 'utf-8',
      ...opts,
    });

    console.log(`$ ${cmd}`);

    if (typeof output === 'string' && output.trim().length > 0) {
      console.log(output);
    }

    return { ok: true, output };
  } catch (err) {
    console.error(`$ ${cmd}`);

    const stderr =
      err.stdout?.toString() || err.stderr?.toString() || err.message;

    console.error(stderr);

    return { ok: false, output: stderr };
  }
}
