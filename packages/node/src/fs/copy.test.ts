import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { copy, copySync } from './copy';
import { mkdirSync } from './dir';
import { readFile, readFileSync, writeFile, writeFileSync } from './json';
import { rmSync } from './remove';

const testPath = path.join(process.cwd(), '.temp/node-utils', 'fs/copy');

beforeAll(() => {
  mkdirSync(testPath);
});

it('fs.copySync file', () => {
  const now = Date.now();
  const src = path.join(testPath, `${now}_sync_src.txt`);
  const dest = path.join(testPath, `${now}_sync_dest.txt`);

  const content = `copy sync file: ${now}`;
  writeFileSync(src, content);

  copySync(src, dest);

  expect(readFileSync(dest)).toBe(content);
});

it('fs.copy file', async () => {
  const now = Date.now();
  const src = path.join(testPath, `${now}_async_src.txt`);
  const dest = path.join(testPath, `${now}_async_dest.txt`);

  const content = `copy async file: ${now}`;
  await writeFile(src, content);

  await copy(src, dest);

  expect(await readFile(dest)).toBe(content);
});

it('fs.copySync dir', () => {
  const now = Date.now();
  const src = path.join(testPath, `${now}_sync_src`);
  // files
  const filePaths = ['a', 'a/a1', 'b', 'b/b1/b2'];
  filePaths.forEach((s) => {
    const dirPath = path.join(src, s);
    mkdirSync(dirPath);
    writeFileSync(path.join(dirPath, 'file.txt'), `copy sync dir: ${now}`);
  });

  const dest = path.join(testPath, `${now}_sync_dest`);

  copySync(src, dest);

  for (const filePath of filePaths) {
    expect(fs.existsSync(path.join(dest, filePath, 'file.txt'))).toBe(true);
  }
});

it('fs.copy dir', async () => {
  const now = Date.now();
  const src = path.join(testPath, `${now}_async_src`);
  // files
  const filePaths = ['a', 'a/a1', 'b', 'b/b1/b2'];
  filePaths.forEach((s) => {
    const dirPath = path.join(src, s);
    mkdirSync(dirPath);
    writeFileSync(path.join(dirPath, 'file.txt'), `copy async dir: ${now}`);
  });

  const dest = path.join(testPath, `${now}_async_dest`);

  await copy(src, dest);

  for (const filePath of filePaths) {
    expect(fs.existsSync(path.join(dest, filePath, 'file.txt'))).toBe(true);
  }
});

afterAll(async () => {
  rmSync(testPath);
});
