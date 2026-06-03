import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { JsonFile } from './JsonFile';

type TestData = {
  name: string;
  age: number;
};

describe('JsonFile', () => {
  let tempDirectoryPath: string;

  beforeEach(async () => {
    tempDirectoryPath = await mkdtemp(join(tmpdir(), 'json-file-test-'));
  });

  afterEach(async () => {
    await rm(tempDirectoryPath, {
      recursive: true,
      force: true,
    });
  });

  test('should write and read JSON data', async () => {
    const filePath = join(tempDirectoryPath, 'data.json');
    const jsonFile = new JsonFile<TestData>(filePath);
    const expectedData: TestData = {
      name: 'John Doe',
      age: 25,
    };

    await jsonFile.write(expectedData);

    const actualData = await jsonFile.read();
    expect(actualData).toEqual(expectedData);
  });

  test('should return true when the file exists', async () => {
    const filePath = join(tempDirectoryPath, 'data.json');
    const jsonFile = new JsonFile<TestData>(filePath);

    await jsonFile.write({
      name: 'John Doe',
      age: 25,
    });

    expect(await jsonFile.exists()).toBe(true);
  });

  test('should return false when the file does not exist', async () => {
    const filePath = join(tempDirectoryPath, 'missing.json');
    const jsonFile = new JsonFile<TestData>(filePath);

    expect(await jsonFile.exists()).toBe(false);
  });

  test('should create parent directories when writing a file', async () => {
    const filePath = join(
      tempDirectoryPath,
      'nested',
      'directory',
      'data.json',
    );
    const jsonFile = new JsonFile<TestData>(filePath);

    await jsonFile.write({
      name: 'John Doe',
      age: 25,
    });

    expect(await jsonFile.exists()).toBe(true);
  });

  test('should throw an error when reading a missing file', async () => {
    const filePath = join(tempDirectoryPath, 'missing.json');
    const jsonFile = new JsonFile<TestData>(filePath);

    await expect(jsonFile.read()).rejects.toThrow(
      `Failed to read JSON file: ${filePath}`,
    );
  });
});
