import type { StorageAdapter } from '../adapters/storage-adapter';
import type { Result } from '../types';
import { STORAGE_KEYS } from '../types';
import { logger } from '../utils/logger';

let storageAdapter: StorageAdapter | null = null;

export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapter = adapter;
}

function ensureAdapter(): StorageAdapter {
  if (!storageAdapter) {
    throw new Error(
      'Storage adapter not initialized. This is an internal error.'
    );
  }
  return storageAdapter;
}

export function getItem<T>(key: string): Promise<Result<T | null>> {
  return ensureAdapter().getItem<T>(key);
}

export function setItem<T>(key: string, value: T): Promise<Result<void>> {
  return ensureAdapter().setItem<T>(key, value);
}

export function removeItem(key: string): Promise<Result<void>> {
  return ensureAdapter().removeItem(key);
}

export async function clearPhaseData(): Promise<Result<void>> {
  try {
    const phaseKeys = Object.values(STORAGE_KEYS);
    await Promise.all(phaseKeys.map((key) => removeItem(key)));
    logger.debug('Cleared Phase SDK storage', { keys: phaseKeys });
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Failed to clear Phase SDK storage', err);
    return { success: false, error: err };
  }
}
