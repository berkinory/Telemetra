import type { LogLevel } from '../types';

const LOG_LEVELS: Record<LogLevel, number> = {
  info: 0,
  warn: 1,
  error: 2,
  none: 3,
};

class Logger {
  private level = LOG_LEVELS.none;

  setLogLevel(level: LogLevel): void {
    this.level = LOG_LEVELS[level];
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (this.level <= LOG_LEVELS.info) {
      if (metadata && Object.keys(metadata).length > 0) {
        console.log(`[Phase] ${message}`, metadata);
      } else {
        console.log(`[Phase] ${message}`);
      }
    }
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (this.level <= LOG_LEVELS.warn) {
      if (metadata && Object.keys(metadata).length > 0) {
        console.warn(`[Phase] ${message}`, metadata);
      } else {
        console.warn(`[Phase] ${message}`);
      }
    }
  }

  error(message: string, error?: unknown): void {
    if (this.level <= LOG_LEVELS.error) {
      if (error instanceof Error) {
        console.error(`[Phase] ${message}:`, error.message);
      } else if (error) {
        console.error(`[Phase] ${message}:`, error);
      } else {
        console.error(`[Phase] ${message}`);
      }
    }
  }
}

export const logger = new Logger();
