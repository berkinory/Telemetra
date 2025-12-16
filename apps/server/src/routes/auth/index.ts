import { ErrorCode, HttpStatus } from '@phase/shared';
import { Elysia, t } from 'elysia';
import { auth } from '@/lib/auth';
import { checkPasswordResetRateLimit } from '@/lib/rate-limit';

export const authRouter = new Elysia({ prefix: '/auth' }).post(
  '/forgot-password',
  async ({ body, request, set }) => {
    const { email, redirectTo } = body;

    const ip = request.headers.get('x-forwarded-for') || undefined;

    const rateLimit = await checkPasswordResetRateLimit(email, ip);

    if (!rateLimit.allowed) {
      set.status = HttpStatus.TOO_MANY_REQUESTS;
      return {
        code: ErrorCode.TOO_MANY_REQUESTS,
        detail: rateLimit.reason || 'Too many requests',
      };
    }

    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: redirectTo || `${process.env.WEB_URL}/reset-password`,
        },
      });

      set.status = HttpStatus.OK;
      return {
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('[Auth] Forgot password error:', error);
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        detail: 'Failed to process password reset request',
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
      redirectTo: t.Optional(t.String()),
    }),
    response: {
      200: t.Object({
        message: t.String(),
      }),
      429: t.Object({
        code: t.String(),
        detail: t.String(),
      }),
      500: t.Object({
        code: t.String(),
        detail: t.String(),
      }),
    },
  }
);
