import fs from 'node:fs';
import fsp from 'node:fs/promises';

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 * @deprecated
 */
export function removeFile(path: string): Promise<void> {
  return fsp.rm(path, { force: true, recursive: true });
}

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 * @deprecated
 */
export function removeFileSync(path: string): void {
  fs.rmSync(path, { force: true, recursive: true });
}

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 */
export function rm(path: string): Promise<void> {
  return fsp.rm(path, { force: true, recursive: true });
}

/**
 * Removes files and directories (modeled on the standard POSIX rm utility).
 */
export function rmSync(path: string): void {
  fs.rmSync(path, { force: true, recursive: true });
}
