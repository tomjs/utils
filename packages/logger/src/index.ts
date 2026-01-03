import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dayjs from 'dayjs';
import logSymbols from 'log-symbols';
import chalk from 'picocolors';
import stripAnsi from 'strip-ansi';

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
   * show time in log
   * @default false
   */
  time?: boolean;
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

  private _log(...args: any[]): void {
    this._writeLog(...args);

    let list = [...args];
    if (this._opts.time) {
      list = [chalk.dim(getTimeFormatter().format(new Date())), ...list];
    }

    console.log(list.map(s => (typeof s === 'object' ? '%o' : '%s')).join(' '), ...list);
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
    this._opts = Object.assign({}, options);
    this.initLogDir();
  }

  /**
   * like console.log
   */
  log(...args: any[]): void {
    this._log(...args);
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
      this._log(
        ...args.map((s) => {
          if (typeof s !== 'object') {
            return chalk.gray(s);
          }
          return s;
        }),
      );
    }
  }

  /**
   * add the specified red prefix or error symbol before the log content
   */
  error(...args: any[]): void {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.red(prefix) : logSymbols.error, ...args);
  }

  /**
   * add the specified blue prefix or info symbol before the log content
   */
  info(...args: any[]): void {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.blue(prefix) : logSymbols.info, ...args);
  }

  /**
   * add the specified green prefix or success symbol before the log content
   */
  success(...args: any[]): void {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.green(prefix) : logSymbols.success, ...args);
  }

  /**
   * add the specified yellow prefix or warning symbol before the log content
   */
  warning(...args: any[]): void {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.yellow(prefix) : logSymbols.warning, ...args);
  }

  /**
   * add the specified yellow prefix or warning symbol before the log content
   */
  warn(...args: any[]): void {
    this.warning(...args);
  }
}

export default Logger;
