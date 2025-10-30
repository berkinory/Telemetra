import Redis from 'ioredis';
import { db, events } from '@/db';

export type AnalyticsEventData = {
  eventId: string;
  sessionId: string;
  name: string;
  params?: Record<string, string | number | boolean | null>;
  timestamp: number;
};

const REDIS_QUEUE_KEY = 'analytics:events:queue';
const BATCH_SIZE = 50;
const BATCH_INTERVAL_MS = 5000;

class SimpleAnalyticsQueue {
  private readonly redis: Redis;
  private processingTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    const url = process.env.UPSTASH_REDIS_URL;
    if (!url) {
      throw new Error('UPSTASH_REDIS_URL must be set');
    }

    this.redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: false,
    });
  }

  async addEvent(event: AnalyticsEventData): Promise<void> {
    await this.redis.rpush(REDIS_QUEUE_KEY, JSON.stringify(event));

    this.startProcessingTimer();
  }

  private startProcessingTimer(): void {
    if (this.processingTimer) {
      return;
    }

    this.processingTimer = setInterval(() => {
      this.processBatch().catch((error) => {
        process.stderr.write(`[Queue] Timer error: ${error}\n`);
      });
    }, BATCH_INTERVAL_MS);
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const eventStrings: string[] = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const eventString = await this.redis.lpop(REDIS_QUEUE_KEY);
        if (!eventString) {
          break;
        }
        eventStrings.push(eventString);
      }

      if (eventStrings.length === 0) {
        this.stopProcessingTimer();
        return;
      }

      const eventsList: AnalyticsEventData[] = [];
      for (const eventString of eventStrings) {
        try {
          const event = JSON.parse(eventString) as AnalyticsEventData;
          eventsList.push(event);
        } catch (error) {
          process.stderr.write(`[Queue] Failed to parse event: ${error}\n`);
        }
      }

      if (eventsList.length === 0) {
        return;
      }

      const eventsToInsert = eventsList.map((event) => ({
        eventId: event.eventId,
        sessionId: event.sessionId,
        name: event.name,
        params: event.params ? JSON.stringify(event.params) : null,
        timestamp: new Date(event.timestamp),
      }));

      await db.insert(events).values(eventsToInsert).onConflictDoNothing();

      process.stdout.write(`[Queue] Processed ${eventsList.length} events\n`);
    } catch (error) {
      process.stderr.write(`[Queue] Processing error: ${error}\n`);
    } finally {
      this.isProcessing = false;
    }
  }

  private stopProcessingTimer(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
  }

  async getQueueSize(): Promise<number> {
    return await this.redis.llen(REDIS_QUEUE_KEY);
  }

  async flush(): Promise<void> {
    while ((await this.getQueueSize()) > 0) {
      await this.processBatch();
    }
  }

  async close(): Promise<void> {
    this.stopProcessingTimer();
    await this.flush();
    await this.redis.quit();
  }
}

export const analyticsQueue = new SimpleAnalyticsQueue();

export const addAnalyticsEvent = async (
  event: AnalyticsEventData
): Promise<void> => {
  await analyticsQueue.addEvent(event);
};

export const getQueueMetrics = async () => {
  const queueSize = await analyticsQueue.getQueueSize();
  return {
    queueSize,
  };
};

export const closeQueue = async (): Promise<void> => {
  await analyticsQueue.close();
};
