/**
 * Generate a uuid of 36 string length
 */
export function uuid36(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a uuid of 32 string length
 */
export function uuid(): string {
  return uuid36().replace(/-/g, '');
}

/**
 * Generate a uuid of 32 string length
 */
export const uuid32 = uuid;
