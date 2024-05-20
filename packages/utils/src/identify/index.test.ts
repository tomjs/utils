import { describe, expect, it } from 'vitest';
import { uuid, uuid32, uuid36 } from './index';

describe('identify test', () => {
  it('uuid', () => {
    expect(uuid().length).toBe(32);
  });
  it('uuid32', () => {
    expect(uuid32().length).toBe(32);
  });
  it('uuid36', () => {
    expect(uuid36().length).toBe(36);
  });
});
