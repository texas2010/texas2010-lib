import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { run } from '../helpers/cwdHelper';

describe('Checking Running Result', () => {
  describe('Fake Backend Project', () => {
    test('Should get result when it running script', () => {
      const root = process.cwd();
      const backendDir = path.join(root, '../backend-project');
      const nodeResult = run('node dist/fake-file.js', { cwd: backendDir });

      expect(nodeResult.output).contain('12345');
    });
  });
  describe('Fake Frontend Project', () => {
    test('Should get result when it running script', () => {
      const root = process.cwd();
      const frontendDir = path.join(root, '../frontend-project');
      const ssrResult = run('node dist/fake-file.ssr.js', {
        cwd: frontendDir,
      });

      expect(ssrResult.output).contain('12345');
    });
  });
});
