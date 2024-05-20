import { describe, expect, it } from 'vitest';
import { urlConcat } from './index';

describe('url test', () => {
  it('urlConcat', () => {
    expect(urlConcat('https://baidu.com/', '/s?wd=test')).toBe('https://baidu.com/s?wd=test');
  });
  it('urlConcat', () => {
    expect(urlConcat('https://baidu.com/', '/s1/', '/s2?wd=test')).toBe(
      'https://baidu.com/s1/s2?wd=test',
    );
  });
});
