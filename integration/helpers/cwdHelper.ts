import { execSync } from 'node:child_process';

export function run(cmd: string, opts: { cwd?: string } = {}) {
  try {
    // Capture output
    const result = execSync(cmd, {
      cwd: opts.cwd,
      stdio: 'pipe', // capture stdout + stderr
    });

    const text = result.toString();

    // Show output in test logs

    return {
      ok: true,
      output: text,
    };
  } catch (err: any) {
    const stderr = err.stderr?.toString() || '';
    const stdout = err.stdout?.toString() || '';

    // Show both for debugging
    console.error(stdout);
    console.error(stderr);

    return {
      ok: false,
      output: stdout + stderr,
      error: err,
    };
  }
}
