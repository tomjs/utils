/**
 * 生成36位uuid
 *
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
 * 生成32位uuid，去除其中4个'-'
 *
 * Generate a uuid of 32 string length
 */
export function uuid(): string {
  return uuid36().replace(/-/g, '');
}

/**
 * 生成32位uuid，去除其中4个'-'
 *
 * Generate a uuid of 32 string length
 */
export const uuid32 = uuid;

const ids: number[] = [];

/**
 * 生成唯一的 Date.now 时间戳
 *
 * Generate a unique Date.now timestamp
 */
export function timestampId(): number {
  let id = Date.now();
  while (ids.includes(id)) {
    id += 1;
  }

  ids.push(id);
  return id;
}

function padLeft(num: number, len = 2): string {
  return num.toString().padStart(len, '0');
}

/**
 * 生成唯一的 Date.now 时间并格式化为 YYYYMMddHHmmssSSS
 *
 * Generate a unique Date.now timestamp and format to YYYYMMddHHmmssSSS
 */
export function datetimeId(): string {
  const date = new Date(timestampId());
  return [
    date.getFullYear(),
    padLeft(date.getMonth() + 1),
    padLeft(date.getDate()),
    padLeft(date.getHours()),
    padLeft(date.getMinutes()),
    padLeft(date.getSeconds()),
    padLeft(date.getMilliseconds(), 3),
  ].join('');
}
