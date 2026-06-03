// src/shared/temp.integration.test.ts
import { test, expect } from 'vitest';

test('shared logic runs in all runtimes', () => {
  // engine-agnostic checks
  expect(typeof Array.prototype.map).toBe('function');
  expect(new URL('https://example.com').hostname).toBe('example.com');
});
