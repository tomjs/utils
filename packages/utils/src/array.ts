import { cloneDeep, groupBy, without } from 'es-toolkit';
import { uuid } from './identify';

/**
 * 为数组生成唯一主键 id
 *
 * Generate a unique id for each array item
 * @param data 数组 | array
 */
export function arrayWithId<T extends object>(data: T[]): (T & { id: any; parentId: any; [key: string]: any })[];

/**
 * 为数组生成唯一主键 id
 *
 * Generate a unique id for each array item
 * @param data 数组 | array
 */
export function arrayWithId<T extends object>(data: T[], withPrefix: true): (T & { _id: any; _parentId: any; [key: string]: any })[];

/**
 * 为数组生成唯一主键 id
 *
 * Generate a unique id for each array item
 * @param data 数组 | array
 * @param withPrefix 是为 id 和 parentId 否添加前缀，默认为 false。| Weather to add a prefix to id and parentId, default is false.
 */
export function arrayWithId<T extends object>(data: T[], withPrefix?: true): T[] {
  const idKey = withPrefix ? '_id' : 'id';
  const parentIdKey = withPrefix ? '_parentId' : 'parentId';

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const list = cloneDeep(data);
  const exec = (arr: any, parentId: any): void => {
    if (Array.isArray(arr)) {
      arr.forEach((s) => {
        exec(s, parentId);
      });
      return;
    }
    const id = uuid();
    arr[idKey] = id;

    if (parentId !== undefined) {
      arr[parentIdKey] = parentId;
    }

    const { children } = arr;
    if (Array.isArray(children)) {
      exec(children, id);
    }
  };

  exec(list, undefined);

  return list;
}

/**
 * 数组转tree结构数据
 *
 * Array to tree structure data
 * @param data 数组数据 | array data
 * @param data[].id 主键id | primary key
 * @param data[].parentId 父级id | parent id
 * @param clone 是否深度克隆，默认 true。| Whether to deep clone, default true.
 */

export function arrayToTree<T extends object>(data: T[], clone = true): T[] {
  if (!Array.isArray(data) || !data.length) {
    return [];
  }

  if (clone) {
    data = cloneDeep(data);
  }

  data.forEach((item: any) => {
    delete item.children;
  });

  const map: Record<string, any> = {};
  data.forEach((item: any) => {
    map[item.id] = item;
  });
  const tree: any[] = [];
  data.forEach((item: any) => {
    const parent = map[item.parentId];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    }
    else {
      tree.push(item);
    }
  });
  return tree;
}

/**
 * tree 转简单的数组
 *
 * Tree to simple array
 * @param data 数组数据 | Tree data
 * @param clone 是否深度克隆 | Whether to clone
 */
export function treeToArray<T extends object>(data: T[], clone = true): T[] {
  const arr: T[] = [];

  const convert = (tree: any[]): void => {
    if (!tree) {
      return;
    }

    if (Array.isArray(tree)) {
      tree.forEach((s) => {
        convert(s);
      });
      return;
    }

    const { children, ...item } = tree as any;
    arr.push(item);
    convert(children);
  };

  if (clone) {
    data = cloneDeep(data);
  }

  convert(data);
  return arr;
}

/**
 * 数组转换为对象，指定主键id
 *
 * Array to object and specify the primary key id
 * @param data 待处理数据 | Data to be processed
 * @param key 标识字段，默认 id | Identifier field, default id
 * @param clone 是否深度克隆，默认 true | Whether to deep clone, default true
 */
export function arrayToMap<T extends object>(
  data: T[],
  key = 'id',
  clone = true,
): Record<string, T> {
  const arr = treeToArray(data, clone);
  const map: Record<string, T> = {};
  if (!Array.isArray(arr)) {
    return map;
  }
  arr.forEach((s: any) => {
    map[s[key]] = s;
  });
  return map;
}

/**
 * 树形数据转换为对象，指定主键id
 *
 * Tree data to object, specify the primary key id
 * @param data 待处理数据 | Data to be processed
 * @param key 主键id | Primary key id
 * @param [clone] 是否深度克隆，默认 true | Whether to deep clone, default true
 */
export function treeToMap(
  data: Record<string, any>[],
  key = 'id',
  clone = true,
): Record<string, any> {
  return arrayToMap(treeToArray(data, clone), key, clone);
}

/**
 * 根据父级id, 获取树形数组所有后代项
 *
 * Get all descendant items of tree array by parent id
 * @param data 待处理的数组 | Array to be processed
 * @param parentId 父级节点id | Parent node id
 * @param key 标识字段，默认 id | Identifier field, default id
 */
export function getArrayChildrenByParentId<T extends object>(
  data: T[] | undefined,
  parentId: string,
  key = 'id',
): T[] | undefined {
  if (!Array.isArray(data)) {
    return;
  }

  const newArray: any = [];
  const search = (pId: any): void => {
    const children = data.filter((s: any) => s.parentId === pId);
    if (children.length === 0) {
      return;
    }
    newArray.push(...children);

    children.forEach((s: any) => {
      search(s[key]);
    });
  };

  search(parentId);

  return newArray;
}

/**
 * 根据父级id, 获取树形数组所有后代项Id
 *
 * Get all descendant item ids based on parent id
 * @param data 待处理的数组
 * @param parentId 父级节点id
 * @param key 标识字段，默认 id | Identifier field, default id
 */
export function getArrayChildrenIdByParentId<T = any>(
  data: Record<string, any>[] | undefined,
  parentId: string,
  key = 'id',
): T[] | undefined {
  const children = getArrayChildrenByParentId(data, parentId, key);
  if (!Array.isArray(children)) {
    return;
  }
  return children.map(s => s[key]);
}

/**
 * 删除树形数据中的空children字段
 *
 * Delete empty children from tree data
 */
export function emptyTreeChildren(data: Record<string, any>[]): Record<string, any>[] {
  const list = cloneDeep(data);
  const handle = (data: any): void => {
    if (Array.isArray(data) && data.length) {
      data.forEach((s) => {
        handle(s);
      });
      return;
    }
    const { children } = data || {};
    if (!Array.isArray(children)) {
      return;
    }
    if (children.length === 0) {
      delete data.children;
    }
    else {
      handle(children);
    }
  };
  handle(list);
  return list;
}

/**
 * label-value 形式的键值对
 *
 * key-value pairs in the form of label-value
 */
export interface LabelValueOption {
  value?: string | number;
  label: string;
  children?: LabelValueOption[];

  [key: string]: any;
}

/**
 * 将 tree 数据的 id 和 name 转换为 value-label 形式的键值对
 *
 * Convert tree data id and name to key-value pairs in the form of value-label
 * @param data 树形数据 | Tree data
 * @param valueProp 值属性，默认 id | Value property, default id
 * @param labelProp 标签属性，默认 name | Label property, default name
 */
export function treeToLabelValue<T extends object>(
  data: T[],
  valueProp = 'id',
  labelProp = 'name',
): LabelValueOption[] {
  if (!Array.isArray(data) || !data.length) {
    return [];
  }

  const convert = (tree: any | any[]): any => {
    if (!tree) {
      return undefined;
    }

    if (Array.isArray(tree)) {
      if (!tree.length) {
        return tree;
      }
      return tree.map(s => convert(s));
    }

    const item: { value: string; label: string; children?: any } = {
      value: tree[valueProp],
      label: tree[labelProp],
    };

    const { children } = tree;
    if (!Array.isArray(children) || children.length === 0) {
      delete item.children;
      return item;
    }

    item.children = convert(children);

    return item;
  };
  return convert(data);
}

/**
 *
 * 过滤数组中的空值，如字符串、null、undefined
 *
 * Filter out empty values such as strings, null, undefined
 * @param data
 */
export function filterArrayNilValue(data: any[]): any[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  return without(data, '', undefined, null);
}

/**
 * 合并数组(id主键)，后面值替换前面值
 *
 * Merge arrays (id primary key), the later value replaces the earlier value
 * @param data 待合并的数组 | Array to be merged
 */
export function mergeArray<T extends object>(...data: T[][]): T[] {
  return mergeArrayBy<T>('id', ...data);
}

/**
 * 合并数组，后面值替换前面值
 * @param key 唯一标识字段，默认 id | Unique identifier field, default id
 * @param data 待合并的数组 | Array to be merged
 */
export function mergeArrayBy<T extends object>(key = 'id', ...data: T[][]): T[] {
  let map: Record<string, any> = {};
  if (Array.isArray(data)) {
    data.forEach((arr) => {
      map = Object.assign(
        {},
        map,
        groupBy(arr, (s: any) => s[key]),
      );
    });
  }
  return Object.keys(map)
    .map((s: string) => map[s] as any)
    .flat(1);
}

/**
 * 数组去重
 *
 * Array items are guaranteed to be unique
 * @param data 待去重的数组 | Array to be deduplicated
 * @param key 唯一标识字段，默认 id | Unique identifier field, default id
 */
export function uniqArray<T extends object>(data: T[], key = 'id'): T[] {
  const keyId = key || 'id';
  const list: T[] = [];
  if (!Array.isArray(data) || !data.length) {
    return data;
  }

  data.forEach((item: any) => {
    const index = list.findIndex((s: any) => s[keyId] === item[keyId]);
    if (index !== -1) {
      list[index] = item;
    }
    else {
      list.push(item);
    }
  });

  return list;
}
