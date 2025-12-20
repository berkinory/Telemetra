import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Result } from '../../core/types';
import { logger } from '../../core/utils/logger';

export async function getItem<T>(key: string): Promise<Result<T | null>> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return { success: true, data: null };
    }

    try {
      return { success: true, data: JSON.parse(value) as T };
    } catch (parseError) {
      logger.error(
        `Corrupted storage data for "${key}". Clearing.`,
        parseError
      );
      await AsyncStorage.removeItem(key);
      return { success: true, data: null };
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to read storage item "${key}"`, err);
    return { success: false, error: err };
  }
}

export async function setItem<T>(key: string, value: T): Promise<Result<void>> {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to write storage item "${key}"`, err);
    return { success: false, error: err };
  }
}

export async function removeItem(key: string): Promise<Result<void>> {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to remove storage item "${key}"`, err);
    return { success: false, error: err };
  }
}

export async function clear(): Promise<Result<void>> {
  try {
    await AsyncStorage.clear();
    return { success: true, data: undefined };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      'Failed to clear storage. Check AsyncStorage permissions.',
      err
    );
    return { success: false, error: err };
  }
}
