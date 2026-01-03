import { expect, it } from 'vitest';
import Logger from '.';

it('test', () => {
  const logger = new Logger({
    prefix: '[tomjs]',
    time: true,
  });
  logger.debug('hello world debug');
  logger.info('hello world info');
  logger.warn('hello world warning');
  logger.error('hello world error');

  expect(1).toBe(1);
});
