import { getRedis } from './redis';

const RATE_LIMIT = {
  maxAttempts: 3,
  ttl: 3600,
};

export async function checkPasswordResetRateLimit(
  email: string,
  ip?: string
): Promise<{ allowed: boolean; reason?: string }> {
  const redis = getRedis();

  if (!redis) {
    return { allowed: true };
  }

  try {
    const emailKey = `rate:reset:email:${email}`;
    const ipKey = ip ? `rate:reset:ip:${ip}` : null;

    const emailCount = await redis.incr(emailKey);
    if (emailCount === 1) {
      await redis.expire(emailKey, RATE_LIMIT.ttl);
    }

    if (emailCount > RATE_LIMIT.maxAttempts) {
      return {
        allowed: false,
        reason: 'Too many password reset attempts',
      };
    }

    if (ipKey) {
      const ipCount = await redis.incr(ipKey);
      if (ipCount === 1) {
        await redis.expire(ipKey, RATE_LIMIT.ttl);
      }

      if (ipCount > RATE_LIMIT.maxAttempts) {
        return {
          allowed: false,
          reason: 'Too many password reset attempts',
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('[RateLimit] Error checking rate limit:', error);
    return { allowed: true };
  }
}
