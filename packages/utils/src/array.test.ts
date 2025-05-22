import { expect, it } from 'vitest';
import { arrayWithId } from './array';

it('[array]arrayWithId', () => {
  const values = arrayWithId([{ name: 'a' }, { name: 'b' }]);
  values.forEach((item) => {
    expect(item.id).toBeDefined();
  });
});

it('[array]arrayWithId withPrefix', () => {
  const values = arrayWithId([{ name: 'a' }, { name: 'b' }], true);
  values.forEach((item) => {
    expect(item._id).toBeDefined();
  });
});
