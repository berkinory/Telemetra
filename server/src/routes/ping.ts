import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { addSessionActivityUpdate } from '@/lib/queue';
import { checkAndCloseExpiredSession, validateSession } from '@/lib/validators';
import {
  ErrorCode,
  errorResponses,
  HttpStatus,
  pingSessionRequestSchema,
  pingSessionResponseSchema,
} from '@/schemas';

const pingSessionRoute = createRoute({
  method: 'post',
  path: '/ping',
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

pingRouter.openapi(pingSessionRoute, async (c) => {
  try {
    const body = c.req.valid('json');

    const sessionValidation = await validateSession(c, body.sessionId);
    if (!sessionValidation.success) {
      return sessionValidation.response;
    }

    const session = sessionValidation.data;

    if (session.endedAt) {
      return c.json(
        {
          code: ErrorCode.VALIDATION_ERROR,
          detail: 'Cannot ping an ended session',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const currentTimestamp = new Date();

    const wasClosed = await checkAndCloseExpiredSession(
      body.sessionId,
      currentTimestamp
    );

    if (wasClosed) {
      return c.json(
        {
          code: ErrorCode.VALIDATION_ERROR,
          detail: 'Session expired. Please create a new session.',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    await addSessionActivityUpdate({
      sessionId: body.sessionId,
      lastActivityAt: currentTimestamp.getTime(),
    });

    return c.json(
      {
        sessionId: body.sessionId,
        lastActivityAt: currentTimestamp.toISOString(),
      },
      HttpStatus.OK
    );
  } catch (error) {
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
