/**
 * 删除字符串左侧的 '/' 符号
 *
 * Trim the '/' symbol to the left of the string
 */
export function trimSlashLeft(url?: string): string {
  if (!url) {
    return '';
  }
  return url.replace(/^\/+/, '');
}

/**
 * 清除字符串结尾的 '/' 符号
 *
 * Trim the '/' symbol to the right of the string
 */
export function trimSlashRight(url?: string): string {
  if (!url) {
    return '';
  }
  return url.replace(/\/+$/, '');
}

/**
 * 清除字符串开头和结尾的 '/' 符号
 *
 * Trim the '/' symbol to the left and right of the string
 */
export function trimSlash(url?: string): string {
  if (!url) {
    return '';
  }
  return url.replace(/^\/+|\/+$/g, '');
}

/**
 * 字符串通过 '/' 符号拼接，用于地址或路径拼接
 *
 * Strings are concatenated with '/' symbols, used for concatenating addresses or paths
 */
export function joinBySlash(...urls: string[]): string {
  return urls.map(s => (s || ''.trim())).filter(s => s).map(trimSlash).join('/');
}

/**
 * 字符串通过 '/' 符号拼接，用于地址或路径拼接
 *
 * Strings are concatenated with '/' symbols, used for concatenating addresses or paths
 *
 * @deprecated use `joinBySlash`
 */
export const urlConcat = joinBySlash;
