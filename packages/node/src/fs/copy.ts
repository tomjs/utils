import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { mkdir } from './dir';

function copyDirSync(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copySync(srcFile, destFile);
  }
}

/**
 * Synchronously copies a file or a directory from the source path to the destination path.
 * If the source is a directory, it recursively copies the entire directory structure.
 * If the source is a file, it directly copies the file to the destination.
 *
 * @param src The source path of the file or directory to be copied.
 * @param dest The destination path where the file or directory should be copied to.
 */
export function copySync(src: string, dest: string): void {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDirSync(src, dest);
  }
  else {
    fs.copyFileSync(src, dest);
  }
}

async function copyDir(srcDir: string, destDir: string): Promise<void> {
  await mkdir(destDir);
  const files = await fsp.readdir(srcDir);

  await Promise.all(
    files.map(file =>
      (async () => {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        await copy(srcFile, destFile);
      })(),
    ),
  );
}

/**
 * Asynchronously copies a file or a directory from the source path to the destination path.
 * If the source is a directory, it recursively copies the entire directory structure.
 * If the source is a file, it directly copies the file to the destination.
 *
 * @param src The source path of the file or directory to be copied.
 * @param dest The destination path where the file or directory should be copied to.
 */
export async function copy(src: string, dest: string): Promise<void> {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    await copyDir(src, dest);
  }
  else {
    await fsp.copyFile(src, dest);
  }
}
