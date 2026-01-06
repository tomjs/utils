import { Logger } from '../src/index';

function logTime() {
  const logger = new Logger({
    prefix: '[tomjs]',
    flag: 'time',
  });
  console.log('--------------time start--------------');
  logger.debug('hello world debug');
  logger.info('hello world info');
  logger.warn('hello world warning');
  logger.error('hello world error');
  logger.success('hello world success');
  console.log('--------------time end----------------');
}

function logSymbol() {
  const logger = new Logger({
    prefix: '[tomjs]',
    debug: true,
    flag: 'symbol',
  });
  console.log('--------------symbol start--------------');
  logger.debug('hello world debug');
  logger.info('hello world info');
  logger.warn('hello world warning');
  logger.error('hello world error');
  logger.success('hello world success');
  console.log('--------------symbol end----------------');
}

function log() {
  const logger = new Logger({
    prefix: '[tomjs]',
    flag: 'none',
  });
  console.log('--------------empty start--------------');
  logger.debug('hello world debug');
  logger.info('hello world info');
  logger.warn('hello world warning');
  logger.error('hello world error');
  logger.success('hello world success');
  console.log('--------------empty end----------------');
}

logTime();
logSymbol();
log();
