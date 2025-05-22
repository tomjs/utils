import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { rm, rmSync } from './remove';

// Adapted from https://github.com/sindresorhus/make-dir
function checkPath(pth: string): void {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      (error as any).code = 'EINVAL';
      throw error;
    }
  }
}

/**
 * Asynchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 */
export function mkdir(dir: string, mode?: string | number): Promise<string | undefined> {
  checkPath(dir);

  return fsp.mkdir(dir, {
    mode: mode ?? 0o777,
    recursive: true,
  });
}
/**
 * Asynchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 * @alias mkdir
 * @returns
 */
export const mkdirp = mkdir;

/**
 * Synchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 */
export function mkdirSync(dir: string, mode?: string | number): string | undefined {
  checkPath(dir);

  return fs.mkdirSync(dir, {
    mode: mode ?? 0o777,
    recursive: true,
  });
}
/**
 * Synchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 */
export const mkdirpSync = mkdirSync;

/**
 * Ensures that a directory is empty. Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created. The directory itself is not deleted.
 * @param dir directory path.
 */
export async function emptyDir(dir: string): Promise<void> {
  await rm(dir);
  await mkdir(dir);
}

/**
 * Ensures that a directory is empty. Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created. The directory itself is not deleted.
 * @param dir directory path.
 */
export function emptyDirSync(dir: string): void {
  rmSync(dir);
  mkdirSync(dir);
}
