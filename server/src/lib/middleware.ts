import { db } from '@/db';
import { auth } from '@/lib/auth';
import { unauthorized } from '@/lib/response';

// biome-ignore lint/suspicious/noExplicitAny: Hono middleware context typing requires any
export const authMiddleware = async (c: any, next: any) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    await next();
    return;
  }

  c.set('user', session.user);
  c.set('session', session.session);
  await next();
};

// biome-ignore lint/suspicious/noExplicitAny: Hono middleware context typing requires any
export const requireAuth = async (c: any, next: any) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return unauthorized(c, 'Authentication required');
  }

  c.set('user', session.user);
  c.set('session', session.session);
  await next();
};

// biome-ignore lint/suspicious/noExplicitAny: Hono middleware context typing requires any
export const requireApiKey = async (c: any, next: any) => {
  await next();
};

// biome-ignore lint/suspicious/noExplicitAny: Hono middleware context typing requires any
export const verifyApiKeyOwnership = async (c: any, next: any) => {
  const user = c.get('user');
  const query = c.req.valid('query');
  const apiKeyId = query.apiKeyId;

  if (!user) {
    return c.json(
      {
        code: 'UNAUTHORIZED',
        detail: 'Authentication required',
      },
      401
    );
  }

  if (!apiKeyId) {
    return c.json(
      {
        code: 'VALIDATION_ERROR',
        detail: 'apiKeyId is required',
      },
      400
    );
  }

  try {
    const userApiKey = await db.query.apikey.findFirst({
      where: (table, { eq: eqFn, and: andFn }) =>
        andFn(eqFn(table.id, apiKeyId), eqFn(table.userId, user.id)),
    });

    if (!userApiKey) {
      return c.json(
        {
          code: 'FORBIDDEN',
          detail: 'You do not have permission to access this API key',
        },
        403
      );
    }

    c.set('apiKey', userApiKey);
    await next();
  } catch (error) {
    console.error('[Middleware] API key ownership verification error:', error);
    return c.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        detail: 'Failed to verify API key ownership',
      },
      500
    );
  }
};
