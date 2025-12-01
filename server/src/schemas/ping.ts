import { t } from 'elysia';

export const PingSessionRequestSchema = t.Object({
  sessionId: t.String({ minLength: 1 }),
  timestamp: t.String({ format: 'date-time' }),
});

export const PingSessionResponseSchema = t.Object({
  sessionId: t.String(),
  lastActivityAt: t.String({ format: 'date-time' }),
});

export type PingSessionRequest = typeof PingSessionRequestSchema.static;
export type PingSessionResponse = typeof PingSessionResponseSchema.static;
