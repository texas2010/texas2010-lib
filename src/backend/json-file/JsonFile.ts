import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class JsonFile<T> {
  public constructor(private readonly filePath: string) {}

  public async read(): Promise<T> {
    try {
      const text = await readFile(this.filePath, 'utf8');

      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Failed to read JSON file: ${this.filePath}`, {
        cause: error,
      });
    }
  }

  public async write(data: T): Promise<void> {
    try {
      await mkdir(dirname(this.filePath), {
        recursive: true,
      });

      await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${this.filePath}`, {
        cause: error,
      });
    }
  }

  public async exists(): Promise<boolean> {
    try {
      await access(this.filePath);

      return true;
    } catch {
      return false;
    }
  }
}
