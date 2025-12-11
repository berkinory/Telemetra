import { t } from 'elysia';
import { CreateDeviceRequestSchema } from './device';
import { CreateEventRequestSchema } from './event';
import { CreateSessionRequestSchema } from './session';

export const BatchDeviceItemSchema = t.Object({
  type: t.Literal('device'),
  payload: CreateDeviceRequestSchema,
  clientOrder: t.Number({ minimum: 0 }),
});

export const BatchSessionItemSchema = t.Object({
  type: t.Literal('session'),
  payload: CreateSessionRequestSchema,
  clientOrder: t.Number({ minimum: 0 }),
});

export const BatchEventItemSchema = t.Object({
  type: t.Literal('event'),
  payload: CreateEventRequestSchema,
  clientOrder: t.Number({ minimum: 0 }),
});

export const BatchItemSchema = t.Union([
  BatchDeviceItemSchema,
  BatchSessionItemSchema,
  BatchEventItemSchema,
]);

const MAX_BATCH_SIZE = 1000;

export const BatchRequestSchema = t.Object({
  items: t.Array(BatchItemSchema, { minItems: 1, maxItems: MAX_BATCH_SIZE }),
});

export const BatchErrorSchema = t.Object({
  clientOrder: t.Number(),
  code: t.String(),
  detail: t.String(),
});

export const BatchResultItemSchema = t.Object({
  clientOrder: t.Number(),
  type: t.Union([
    t.Literal('device'),
    t.Literal('session'),
    t.Literal('event'),
  ]),
  id: t.String(),
});

export const BatchResponseSchema = t.Object({
  processed: t.Number({ minimum: 0 }),
  failed: t.Number({ minimum: 0 }),
  errors: t.Array(BatchErrorSchema),
  results: t.Array(BatchResultItemSchema),
});

export type BatchDeviceItem = typeof BatchDeviceItemSchema.static;
export type BatchSessionItem = typeof BatchSessionItemSchema.static;
export type BatchEventItem = typeof BatchEventItemSchema.static;
export type BatchItem = typeof BatchItemSchema.static;
export type BatchRequest = typeof BatchRequestSchema.static;
export type BatchError = typeof BatchErrorSchema.static;
export type BatchResultItem = typeof BatchResultItemSchema.static;
export type BatchResponse = typeof BatchResponseSchema.static;
