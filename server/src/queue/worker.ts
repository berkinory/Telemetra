import { type Job, Worker } from 'bullmq';
import { db, events } from '@/db';
import { getRedisConnection, QUEUE_CONFIG } from './config';
import type { BatchJobData } from './index';

type InsertResult = {
  successCount: number;
  duplicateCount: number;
  errorCount: number;
};

const isDuplicateError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }
  const err = error as { code: string };
  return err.code === 'SQLITE_CONSTRAINT' || err.code === '23505';
};

const insertEventIndividually = async (
  event: typeof events.$inferInsert
): Promise<'success' | 'duplicate' | 'error'> => {
  try {
    await db.insert(events).values(event);
    return 'success';
  } catch (insertError) {
    if (isDuplicateError(insertError)) {
      return 'duplicate';
    }
    console.error(
      `[Worker] Failed to insert event ${event.eventId}:`,
      insertError
    );
    return 'error';
  }
};

const retryIndividualInserts = async (
  eventsToInsert: (typeof events.$inferInsert)[],
  batchId: string
): Promise<InsertResult> => {
  console.warn(
    `[Worker] Duplicate events detected in batch ${batchId}, attempting individual inserts`
  );

  const result: InsertResult = {
    successCount: 0,
    duplicateCount: 0,
    errorCount: 0,
  };

  for (const event of eventsToInsert) {
    const insertResult = await insertEventIndividually(event);

    if (insertResult === 'success') {
      result.successCount++;
    } else if (insertResult === 'duplicate') {
      result.duplicateCount++;
    } else {
      result.errorCount++;
    }
  }

  if (result.errorCount > 0 && result.successCount === 0) {
    throw new Error(
      `All ${result.errorCount} events failed to insert in batch ${batchId}`
    );
  }

  return result;
};

const processBatchJob = async (job: Job<BatchJobData>): Promise<void> => {
  const { events: eventsList, batchId } = job.data;

  if (eventsList.length === 0) {
    console.warn(`[Worker] No events to process in batch ${batchId}`);
    return;
  }

  const eventsToInsert = eventsList.map((event) => ({
    eventId: event.eventId,
    sessionId: event.sessionId,
    name: event.name,
    params: event.params ? JSON.stringify(event.params) : null,
    timestamp: new Date(event.timestamp),
  }));

  try {
    await db.insert(events).values(eventsToInsert);
  } catch (error) {
    if (isDuplicateError(error)) {
      await retryIndividualInserts(eventsToInsert, batchId);
    } else {
      console.error(`[Worker] Database error in batch ${batchId}:`, error);
      throw error;
    }
  }
};

export const createAnalyticsEventsWorker = (): Worker<BatchJobData> => {
  const worker = new Worker<BatchJobData>(
    QUEUE_CONFIG.QUEUE_NAME,
    processBatchJob,
    {
      connection: getRedisConnection(),
      concurrency: QUEUE_CONFIG.CONCURRENCY,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    }
  );

  return worker;
};
