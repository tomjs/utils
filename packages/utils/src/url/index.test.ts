import { describe, expect, it } from 'vitest';
import { urlConcat } from './index';

describe('url test', () => {
  it('urlConcat 1', () => {
    expect(urlConcat('https://baidu.com/', '/s?wd=test')).toBe('https://baidu.com/s?wd=test');
  });
  it('urlConcat 2', () => {
    expect(urlConcat('https://baidu.com/', '/s1/', '/s2?wd=test')).toBe(
      'https://baidu.com/s1/s2?wd=test',
    );
  });
});
