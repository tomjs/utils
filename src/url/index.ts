/**
 * Concatenate urls using `/` to form a complete url
 * @param urls url paths
 * @returns
 */
export function urlConcat(...urls: string[]) {
  return urls
    .map(s => (s || '').trim())
    .filter(s => s)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/:\//, '://');
}
