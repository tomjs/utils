import { describe, expect, it } from 'vitest';
import { joinBySlash } from './url';

describe('url test', () => {
  it('joinBySlash 1', () => {
    expect(joinBySlash('https://baidu.com/', '/s?wd=test')).toBe('https://baidu.com/s?wd=test');
  });
  it('joinBySlash 2', () => {
    expect(joinBySlash('https://baidu.com/', '/s1/', '/s2?wd=test')).toBe(
      'https://baidu.com/s1/s2?wd=test',
    );
  });
});
