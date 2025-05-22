import { merge as _merge } from 'es-toolkit';

/**
 * 合并生成新对象
 */
export function mergeObject<T extends object>(...objects: (T | undefined)[]): T {
  let obj = Object.create(null);
  for (const object of objects) {
    if (!object) {
      continue;
    }
    obj = _merge(obj, object);
  }
  return obj;
}
