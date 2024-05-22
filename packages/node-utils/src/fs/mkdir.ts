import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

// Adapted from https://github.com/sindresorhus/make-dir
const checkPath = (pth: string) => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`);
      // @ts-ignore
      error.code = 'EINVAL';
      throw error;
    }
  }
};

/**
 * Asynchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 * @returns
 */
export function mkdir(dir: string, mode?: string | number) {
  checkPath(dir);

  return fsp.mkdir(dir, {
    mode: mode ?? 0o777,
    recursive: true,
  });
}

/**
 * Synchronously creates a directory. Returns undefined, or if recursive is true, the first directory path created.
 * @param dir directory path.
 * @param mode directory permission mode. If not specified, defaults to 0o777.
 * @returns
 */
export function mkdirSync(dir: string, mode?: string | number) {
  checkPath(dir);

  return fs.mkdirSync(dir, {
    mode: mode ?? 0o777,
    recursive: true,
  });
}
