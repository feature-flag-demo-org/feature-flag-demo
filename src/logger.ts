type LogLevel = 'error' | 'warn' | 'info' | 'debug';
const LogLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  private level = LogLevels.info;

  setLevel(level: LogLevel) {
    this.level = LogLevels[level];
  }

  error(message: string, ...args: unknown[]) {
    if (this.level >= LogLevels.error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]) {
    if (this.level >= LogLevels.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]) {
    if (this.level >= LogLevels.info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]) {
    if (this.level >= LogLevels.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
