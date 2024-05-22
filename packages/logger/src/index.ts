import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';
import dayjs from 'dayjs';
import logSymbols from 'log-symbols';
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
}

/**
 * log tool
 */
export class Logger {
  private _opts: LoggerOptions = {};
  private _logDir?: string;
  private _debug = false;

  constructor(opts?: LoggerOptions) {
    this._opts = Object.assign({}, opts);

    this.initLogDir();
  }

  private initLogDir() {
    const { directory, cleanup } = this._opts;
    if (!directory) {
      return;
    }

    const logDir = path.join(os.homedir(), '.tomjs', directory);
    this._logDir = logDir;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.readdirSync(logDir).forEach(s => {
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

  private format(...args: any[]) {
    return args.map(s => (typeof s === 'object' ? JSON.stringify(s) : s || '')).join(' ');
  }

  private _writeLog(...args: any[]) {
    if (!this._logDir) {
      return;
    }
    const logFile = path.join(this._logDir, `${dayjs().format('YYYYMMDD')}.log`);
    fs.appendFileSync(
      logFile,
      `${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')} ${stripAnsi(this.format(...args))}\n`,
    );
  }

  private _log(...args: any[]) {
    this._writeLog(...args);

    let list = [...args];
    if (this._opts.time) {
      list = [dayjs().format('HH:mm:ss'), ...list];
    }

    console.log(list.map(s => (typeof s === 'object' ? '%o' : '%s')).join(' '), ...list);
  }

  /**
   * set debug mode or not
   */
  enableDebug(debug: boolean) {
    this._debug = debug ?? true;
  }

  /**
   * like console.log
   */
  log(...args: any[]) {
    this._log(...args);
  }

  /**
   * write log to file
   */
  write(...args: any[]) {
    this._writeLog(...args);
  }

  /**
   * only show in debug mode
   */
  debug(...args: any[]) {
    if (this._debug) {
      this._log(
        ...args.map(s => {
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
  error(...args: any[]) {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.red(prefix) : logSymbols.error, ...args);
  }

  /**
   * add the specified blue prefix or info symbol before the log content
   */
  info(...args: any[]) {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.blue(prefix) : logSymbols.info, ...args);
  }

  /**
   * add the specified green prefix or success symbol before the log content
   */
  success(...args: any[]) {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.green(prefix) : logSymbols.success, ...args);
  }

  /**
   * add the specified yellow prefix or warning symbol before the log content
   */
  warning(...args: any[]) {
    const { prefix } = this._opts;
    this._log(prefix ? chalk.yellow(prefix) : logSymbols.warning, ...args);
  }
}

export default Logger;
