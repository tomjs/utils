import fs from 'node:fs';
import fsp from 'node:fs/promises';

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 * @returns
 */
export function removeFile(path: string) {
  return fsp.rm(path, { force: true, recursive: true });
}

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 * @returns
 */
export function removeFileSync(path: string) {
  fs.rmSync(path, { force: true, recursive: true });
}
