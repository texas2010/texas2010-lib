import { beforeEach, describe, expect, test, vi } from 'vitest';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';

import { JsonFile } from './JsonFile';

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

type TestData = {
  name: string;
  age: number;
};

const mockedAccess = vi.mocked(access);
const mockedMkdir = vi.mocked(mkdir);
const mockedReadFile = vi.mocked(readFile);
const mockedWriteFile = vi.mocked(writeFile);

describe('JsonFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('read should read and parse JSON data', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    mockedReadFile.mockResolvedValue(
      JSON.stringify({
        name: 'John Doe',
        age: 25,
      }),
    );

    await expect(jsonFile.read()).resolves.toEqual({
      name: 'John Doe',
      age: 25,
    });

    expect(mockedReadFile).toHaveBeenCalledWith('/test/data.json', 'utf8');
  });

  test('read should throw a useful error when reading fails', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    mockedReadFile.mockRejectedValue(new Error('File does not exist'));

    await expect(jsonFile.read()).rejects.toThrow(
      'Failed to read JSON file: /test/data.json',
    );
  });

  test('write should create parent directory and write JSON data', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    const data: TestData = {
      name: 'John Doe',
      age: 25,
    };

    await jsonFile.write(data);

    expect(mockedMkdir).toHaveBeenCalledWith('/test', {
      recursive: true,
    });

    expect(mockedWriteFile).toHaveBeenCalledWith(
      '/test/data.json',
      JSON.stringify(data, null, 2),
      'utf8',
    );
  });

  test('write should throw a useful error when writing fails', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    mockedWriteFile.mockRejectedValue(new Error('Write failed'));

    await expect(
      jsonFile.write({
        name: 'John Doe',
        age: 25,
      }),
    ).rejects.toThrow('Failed to write JSON file: /test/data.json');
  });

  test('exists should return true when the file exists', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    mockedAccess.mockResolvedValue(undefined);

    await expect(jsonFile.exists()).resolves.toBe(true);

    expect(mockedAccess).toHaveBeenCalledWith('/test/data.json');
  });

  test('exists should return false when the file does not exist', async () => {
    const jsonFile = new JsonFile<TestData>('/test/data.json');

    mockedAccess.mockRejectedValue(new Error('File does not exist'));

    await expect(jsonFile.exists()).resolves.toBe(false);
  });
});
