import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dayjs from 'dayjs';
import colors from 'picocolors';
import stripAnsi from 'strip-ansi';
import { logColors, logSymbols } from './colors';

export interface LoggerOptions {
  /**
   * log prefix
   */
  prefix?: string;
  /**
   * enable debug mode
   * @default false
   */
  debug?: boolean;
  /**
   * show time in log. use `flag:"time"` replace time
   * @default false
   * @deprecated
   */
  time?: boolean;
  /**
   * show log symbols
   * @default 'symbol'
   */
  flag?: 'time' | 'symbol' | 'none';
  /**
   * specify the log directory name
   */
  directory?: string;
  /**
   * specify the log cleanup period
   * @default 30
   */
  cleanup?: number;
  /**
   * log file root directory，default is '～/.tomjs'
   */
  root?: string;
}

// copy https://github.com/vitejs/vite/blob/2ba4e990192845e01c733aa186c9599cdb5bb8fe/packages/vite/src/node/logger.ts#L58-L66
let timeFormatter: Intl.DateTimeFormat;
function getTimeFormatter() {
  timeFormatter ??= new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return timeFormatter;
}

/**
 * log tool
 */
export class Logger {
  private _opts: LoggerOptions = {};
  private _logDir?: string;

  constructor(options?: LoggerOptions) {
    this.setOptions(Object.assign({}, options));
  }

  private initLogDir(): void {
    const { directory, cleanup } = this._opts;
    if (!directory) {
      return;
    }

    const root = this._opts.root || path.join(os.homedir(), '.tomjs');

    const logDir = path.join(root, directory);
    this._logDir = logDir;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.readdirSync(logDir).forEach((s) => {
      if (
        dayjs(s.substring(0, 8)).isBefore(
          dayjs()
            .endOf('day')
            .subtract(Math.max(1, cleanup ?? 30), 'day'),
        )
      ) {
        fs.rmSync(path.join(logDir, s), { force: true });
      }
    });
  }

  private format(...args: any[]): string {
    return args.map(s => (typeof s === 'object' ? JSON.stringify(s) : s || '')).join(' ');
  }

  private _writeLog(...args: any[]): void {
    if (!this._logDir) {
      return;
    }
    const logFile = path.join(this._logDir, `${dayjs().format('YYYYMMDD')}.log`);
    fs.appendFileSync(
      logFile,
      `${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')} ${stripAnsi(this.format(...args))}\n`,
    );
  }

  private _log(type: 'info' | 'warn' | 'error' | 'success' | 'log', ...args: any[]): void {
    this._writeLog(type, ...args);

    const flag = this._opts.flag || 'symbol';
    const preList: string[] = [];
    if (flag === 'time') {
      preList.push(colors.dim(getTimeFormatter().format(new Date())));
    }
    else if (flag === 'symbol') {
      preList.push(logSymbols[type]);
    }

    const { prefix } = this._opts;
    if (prefix) {
      preList.push(logColors[type](colors.bold(prefix)));
    }

    const list = preList.concat(args);
    console.log(preList.concat(args).map(s => (typeof s === 'object' ? '%o' : '%s')).join(' '), ...list);
  }

  /**
   * set debug mode or not
   */
  enableDebug(debug: boolean): void {
    this._opts.debug = !!debug;
  }

  /**
   * set debug mode or not
   */
  setOptions(options: LoggerOptions): void {
    this._opts = Object.assign({}, this._opts, options);
    this.initLogDir();
  }

  /**
   * like console.log
   */
  log(...args: any[]): void {
    this._log('log', ...args);
  }

  /**
   * write log to file
   */
  write(...args: any[]): void {
    this._writeLog(...args);
  }

  /**
   * only show in debug mode
   */
  debug(...args: any[]): void {
    if (this._opts.debug) {
      this._log('log', ...args);
    }
  }

  /**
   * add the specified red prefix or error symbol before the log content
   */
  error(...args: any[]): void {
    this._log(`error`, ...args);
  }

  /**
   * add the specified blue prefix or info symbol before the log content
   */
  info(...args: any[]): void {
    this._log('info', ...args);
  }

  /**
   * add the specified green prefix or success symbol before the log content
   */
  success(...args: any[]): void {
    this._log('success', ...args);
  }

  /**
   * add the specified yellow prefix or warning symbol before the log content
   */
  warning(...args: any[]): void {
    this._log('warn', ...args);
  }

  /**
   * add the specified yellow prefix or warning symbol before the log content
   */
  warn(...args: any[]): void {
    this.warning(...args);
  }
}

export default Logger;
