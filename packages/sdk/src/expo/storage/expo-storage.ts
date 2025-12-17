import {
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';
import type { Result } from '../../core/types';
import { logger } from '../../core/utils/logger';

const STORAGE_DIR = `${documentDirectory}phase_analytics/`;

async function ensureStorageDir(): Promise<void> {
  try {
    const dirInfo = await getInfoAsync(STORAGE_DIR);
    if (!dirInfo.exists) {
      await makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
    }
  } catch (error) {
    logger.error('Failed to create storage directory', error);
  }
}

function getFilePath(key: string): string {
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${STORAGE_DIR}${safeKey}.json`;
}

export async function getItem<T>(key: string): Promise<Result<T | null>> {
  try {
    await ensureStorageDir();
    const filePath = getFilePath(key);
    const fileInfo = await getInfoAsync(filePath);

    if (!fileInfo.exists) {
      return { success: true, data: null };
    }

    const content = await readAsStringAsync(filePath);

    if (!content) {
      return { success: true, data: null };
    }

    try {
      return { success: true, data: JSON.parse(content) as T };
    } catch (parseError) {
      logger.error(
        `Corrupted JSON in storage for key: ${key}, clearing`,
        parseError
      );
      await deleteAsync(filePath, { idempotent: true });
      return { success: true, data: null };
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to get item from storage: ${key}`, err);
    return { success: false, error: err };
  }
}

export async function setItem<T>(key: string, value: T): Promise<Result<void>> {
  try {
    await ensureStorageDir();
    const filePath = getFilePath(key);
    const serialized = JSON.stringify(value);
    await writeAsStringAsync(filePath, serialized);
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to set item in storage: ${key}`, err);
    return { success: false, error: err };
  }
}

export async function removeItem(key: string): Promise<Result<void>> {
  try {
    const filePath = getFilePath(key);
    await deleteAsync(filePath, { idempotent: true });
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to remove item from storage: ${key}`, err);
    return { success: false, error: err };
  }
}

export async function clear(): Promise<Result<void>> {
  try {
    const dirInfo = await getInfoAsync(STORAGE_DIR);
    if (dirInfo.exists && dirInfo.isDirectory) {
      await deleteAsync(STORAGE_DIR, { idempotent: true });
    }
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Failed to clear storage', err);
    return { success: false, error: err };
  }
}
