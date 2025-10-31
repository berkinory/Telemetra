import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { db, sessions } from '@/db';
import { methodNotAllowed } from '@/lib/response';
import { validateSession, validateTimestamp } from '@/lib/validators';
import {
  ErrorCode,
  errorResponses,
  HttpStatus,
  pingSessionRequestSchema,
  pingSessionResponseSchema,
} from '@/schemas';

const pingSessionRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['ping'],
  description: 'Ping/Heartbeat for active session',
  request: {
    body: {
      content: {
        'application/json': {
          schema: pingSessionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Session pinged successfully',
      content: {
        'application/json': {
          schema: pingSessionResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
});

const pingRouter = new OpenAPIHono();

pingRouter.all('*', async (c, next) => {
  const method = c.req.method;
  const allowedMethods = ['POST'];

  if (!allowedMethods.includes(method)) {
    return methodNotAllowed(c, allowedMethods);
  }

  await next();
});

pingRouter.openapi(pingSessionRoute, async (c) => {
  try {
    const body = c.req.valid('json');

    const sessionValidation = await validateSession(c, body.sessionId);
    if (!sessionValidation.success) {
      return sessionValidation.response;
    }

    const timestampValidation = validateTimestamp(c, body.timestamp);
    if (!timestampValidation.success) {
      return timestampValidation.response;
    }

    const clientTimestamp = timestampValidation.data;

    await db.transaction(async (tx) => {
      const currentSession = await tx.query.sessions.findFirst({
        where: (table, { eq: eqFn }) => eqFn(table.sessionId, body.sessionId),
      });

      if (!currentSession) {
        throw new Error('Session not found');
      }

      const result = await tx
        .update(sessions)
        .set({
          lastActivityAt: clientTimestamp,
        })
        .where(eq(sessions.sessionId, body.sessionId));

      if (result.rowCount === 0) {
        throw new Error('Failed to update session');
      }
    });

    return c.json(
      {
        sessionId: body.sessionId,
        lastActivityAt: clientTimestamp.toISOString(),
      },
      HttpStatus.OK
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to ping session';

    if (errorMessage.includes('not found')) {
      return c.json(
        {
          code: ErrorCode.VALIDATION_ERROR,
          detail: errorMessage,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    console.error('[Session.Ping] Error:', error);
    return c.json(
      {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        detail: 'Failed to ping session',
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
});

export default pingRouter;
