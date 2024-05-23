import fs from 'node:fs';
import fsp from 'node:fs/promises';

/**
 * Synchronously reads the entire contents of a file.
 * @param path A path to a file
 */
export function readFileSync(path: string) {
  return fs.readFileSync(path, 'utf8');
}

/**
 * Asynchronously reads the entire contents of a file.
 * @param path A path to a file
 */
export function readFile(path: string) {
  return fsp.readFile(path, 'utf8');
}

/**
 * Synchronously writes data to a file.
 * @param path A path to a file
 * @param data Data to write to the file
 */
export function writeFileSync(path: string, data: string) {
  fs.writeFileSync(path, data, 'utf8');
}

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * @param path A path to a file
 * @param data Data to write to the file
 */
export function writeFile(path: string, data: string) {
  return fsp.writeFile(path, data, 'utf8');
}

/**
 * Synchronously reads the entire contents of a file, and returns the parsed JSON.
 * @param path path to json file
 */
export function readJsonSync(path: string) {
  if (fs.existsSync(path)) {
    return JSON.parse(readFileSync(path));
  }
}

/**
 * Asynchronously reads the entire contents of a file, and returns the parsed JSON.
 * @param path path to json file
 */
export async function readJson(path: string) {
  if (fs.existsSync(path)) {
    const text = await readFile(path);
    return JSON.parse(text);
  }
}

export interface WriteJsonOptions {
  space?: string | number;
  replacer?: (key: string, value: any) => any;
}

/**
 * Synchronously writes json data to a file.
 * @param path path to json file
 * @param data data to write
 */
export function writeJsonSync(path: string, data: string | object, options?: WriteJsonOptions) {
  const opts: WriteJsonOptions = Object.assign(
    {
      replacer: null,
      space: 2,
    },
    options,
  );

  writeFileSync(
    path,
    typeof data === 'string' ? data : JSON.stringify(data, opts.replacer, opts.space),
  );
}

/**
 * Synchronously writes json data to a file.
 * @param path path to json file
 * @param data data to write
 */
export function writeJson(path: string, data: string | object, options?: WriteJsonOptions) {
  const opts: WriteJsonOptions = Object.assign(
    {
      replacer: null,
      space: 2,
    },
    options,
  );

  return writeFile(
    path,
    typeof data === 'string' ? data : JSON.stringify(data, opts.replacer, opts.space),
  );
}
