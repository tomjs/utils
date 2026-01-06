import isUnicodeSupported from 'is-unicode-supported';
// copy https://github.com/sindresorhus/log-symbols/blob/aab590f8cb4b895b39f3d6d97d458daa6a8fc9ae/symbols.js
import colors from 'picocolors';

const supported = isUnicodeSupported();

export const logColors = {
  info: colors.cyan,
  success: colors.green,
  warn: colors.yellow,
  warning: colors.yellow,
  error: colors.red,
  debug: colors.gray,
  log: colors.gray,
};

export const logSymbols = {
  info: colors.cyan(supported ? 'ℹ' : 'i'),
  success: colors.green(supported ? '✔' : '√'),
  warn: colors.yellow(supported ? '⚠' : '!'),
  warning: colors.yellow(supported ? '⚠' : '!'),
  error: colors.red(supported ? '✖' : 'x'),
  debug: colors.gray(supported ? '◎' : '#'),
  log: colors.gray(supported ? '◎' : '#'),
};
