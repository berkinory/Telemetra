import type { HttpClient } from '../client/http-client';
import type { BatchItem, BatchRequest } from '../types';
import { VALIDATION } from '../types';
import { logger } from '../utils/logger';
import type { OfflineQueue } from './offline-queue';

const MAX_RETRY_COUNT = 5;

export class BatchSender {
  private readonly httpClient: HttpClient;
  private readonly offlineQueue: OfflineQueue;
  private isFlushing = false;

  constructor(httpClient: HttpClient, offlineQueue: OfflineQueue) {
    this.httpClient = httpClient;
    this.offlineQueue = offlineQueue;
  }

  async flush(): Promise<void> {
    if (this.isFlushing) {
      logger.warn('Flush already in progress. Skipping duplicate flush.');
      return;
    }

    this.isFlushing = true;

    try {
      const items = await this.offlineQueue.dequeueAll();

      if (items.length === 0) {
        return;
      }

      const deduplicatedItems = this.deduplicateByTimestamp(items);
      const batches = this.splitIntoBatches(deduplicatedItems);

      for (const batch of batches) {
        try {
          const success = await this.sendBatch(batch);
          if (!success) {
            await this.requeue(batch);
          }
        } catch (error) {
          logger.error('Batch send error. Re-queueing for retry.', error);
          await this.requeue(batch);
        }
      }
    } finally {
      this.isFlushing = false;
    }
  }

  private async requeue(items: BatchItem[]): Promise<void> {
    const requeuePromises = items.map(async (item) => {
      const retryCount = (item.retryCount ?? 0) + 1;

      if (retryCount > MAX_RETRY_COUNT) {
        logger.error('Max retries exceeded. Dropping item.', {
          type: item.type,
          clientOrder: item.clientOrder,
          retryCount,
        });
        return;
      }

      try {
        await this.offlineQueue.enqueue({ ...item, retryCount });
      } catch (error) {
        logger.error('Failed to re-enqueue item. Data may be lost.', error);
      }
    });

    await Promise.all(requeuePromises);
  }

  private async sendBatch(items: BatchItem[]): Promise<boolean> {
    const itemsWithoutRetryCount = items.map(({ retryCount, ...item }) => item);
    const request: BatchRequest = { items: itemsWithoutRetryCount };
    const result = await this.httpClient.sendBatch(request);

    if (!result.success) {
      logger.error('Batch request failed. Will retry.', result.error);
      return false;
    }

    const response = result.data;
    if (response.failed && response.failed > 0) {
      logger.error(
        `Batch partially failed: ${response.failed}/${(response.processed ?? 0) + response.failed} items`
      );

      if (Array.isArray(response.errors)) {
        const failedItems: BatchItem[] = [];

        for (const error of response.errors) {
          if (error.clientOrder === undefined) {
            logger.error('Error missing clientOrder. Cannot re-enqueue.');
            continue;
          }
          const failedItem = items.find(
            (item) => item.clientOrder === error.clientOrder
          );
          if (failedItem) {
            failedItems.push(failedItem);
          }
        }

        if (failedItems.length > 0) {
          await this.requeue(failedItems);
        }
      }
    }

    return true;
  }

  private deduplicateByTimestamp(items: BatchItem[]): BatchItem[] {
    const seenEvents = new Map<string, number>();
    const dedupedItems: BatchItem[] = [];
    const DEDUP_WINDOW_MS = 50;

    for (const item of items) {
      if (item.type === 'event') {
        const key = this.createEventKey(item.payload.name, item.payload.params);

        let timestamp: number;
        try {
          timestamp = new Date(item.payload.timestamp).getTime();
          if (Number.isNaN(timestamp)) {
            logger.warn('Invalid timestamp format. Including event anyway.');
            dedupedItems.push(item);
            continue;
          }
        } catch {
          logger.warn('Failed to parse timestamp. Including event anyway.');
          dedupedItems.push(item);
          continue;
        }

        const lastTime = seenEvents.get(key);
        if (lastTime !== undefined && timestamp - lastTime < DEDUP_WINDOW_MS) {
          logger.warn('Duplicate event in batch detected. Dropping event.', {
            name: item.payload.name,
          });
          continue;
        }

        seenEvents.set(key, timestamp);
        dedupedItems.push(item);
      } else {
        dedupedItems.push(item);
      }
    }

    const droppedCount = items.length - dedupedItems.length;
    if (droppedCount > 0) {
      logger.info(
        `Dropped ${droppedCount} duplicate event(s) from batch based on timestamp.`
      );
    }

    return dedupedItems;
  }

  private createEventKey(
    name: string,
    params?: Record<string, string | number | boolean | null>
  ): string {
    if (!params) {
      return name;
    }
    try {
      const sortedParams = Object.keys(params)
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = params[key];
            return acc;
          },
          {} as Record<string, string | number | boolean | null>
        );
      return `${name}:${JSON.stringify(sortedParams)}`;
    } catch {
      return name;
    }
  }

  private splitIntoBatches(items: BatchItem[]): BatchItem[][] {
    const batches: BatchItem[][] = [];
    const maxSize = VALIDATION.BATCH.MAX_SIZE;

    for (let i = 0; i < items.length; i += maxSize) {
      batches.push(items.slice(i, i + maxSize));
    }

    return batches;
  }
}
