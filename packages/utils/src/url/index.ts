/**
 * Concatenate urls using `/` to form a complete url
 * @param parts url paths
 * @returns
 */
export function urlConcat(...parts: string[]) {
  return parts
    .map(part => (part || '').trim())
    .filter(part => part)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/:\//, '://');
}
