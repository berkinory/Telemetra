import type { Result } from '../types';

export type StorageAdapter = {
  getItem<T>(key: string): Promise<Result<T | null>>;
  setItem<T>(key: string, value: T): Promise<Result<void>>;
  removeItem(key: string): Promise<Result<void>>;
  clear(): Promise<Result<void>>;
};
