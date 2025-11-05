import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import Redis from 'ioredis';
import { pool } from '@/db';
import { methodNotAllowed } from '@/lib/response';
import { errorResponses, HttpStatus } from '@/schemas';

const healthResponseSchema = z.object({
  timestamp: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
  uptime: z.number().openapi({ example: 123.45 }),
  status: z.enum(['healthy', 'unhealthy']).openapi({ example: 'healthy' }),
  services: z.object({
    database: z.object({
      status: z.enum(['healthy', 'unhealthy', 'unknown']),
      latency: z.number(),
      error: z.string().optional(),
      message: z.string().optional(),
    }),
    questdb: z.object({
      status: z.enum(['healthy', 'unhealthy', 'unknown']),
      latency: z.number(),
      error: z.string().optional(),
      message: z.string().optional(),
    }),
    cache: z.object({
      status: z.enum(['healthy', 'unhealthy', 'unknown']),
      latency: z.number(),
      error: z.string().optional(),
      enabled: z.boolean(),
      strategy: z.string().optional(),
      ttl: z.number().optional(),
    }),
  }),
  responseTime: z.number().openapi({ example: 10 }),
});

const getHealthRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['health'],
  description: 'Health check',
  responses: {
    200: {
      description: 'Health status',
      content: {
        'application/json': {
          schema: healthResponseSchema,
        },
      },
    },
    ...errorResponses,
  },
});

const health = new OpenAPIHono();

health.all('*', async (c, next) => {
  const method = c.req.method;
  const allowedMethods = ['GET'];

  if (!allowedMethods.includes(method)) {
    return methodNotAllowed(c, allowedMethods);
  }

  return await next();
});

type ServiceStatus = {
  status: 'healthy' | 'unhealthy' | 'unknown';
  latency: number;
  error?: string;
  message?: string;
};

type HealthCheckData = {
  timestamp: string;
  uptime: number;
  status: 'healthy' | 'unhealthy';
  services: {
    database: ServiceStatus;
    questdb: ServiceStatus;
    cache: ServiceStatus & {
      enabled: boolean;
      strategy?: string;
      ttl?: number;
    };
  };
  responseTime: number;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Health check needs to test multiple services
health.openapi(getHealthRoute, async (c) => {
  const startTime = Date.now();
  let overallStatus: 'healthy' | 'unhealthy' = 'healthy';

  const services: HealthCheckData['services'] = {
    database: { status: 'unknown', latency: 0 },
    questdb: { status: 'unknown', latency: 0 },
    cache: { status: 'unknown', latency: 0, enabled: false },
  };

  try {
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    services.database = {
      status: 'healthy',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    overallStatus = 'unhealthy';
    services.database = {
      status: 'unhealthy',
      latency: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown database connection error',
    };
  }

  try {
    const questdbStart = Date.now();
    const response = await fetch('http://questdb:9000/exec?query=SELECT%201', {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      services.questdb = {
        status: 'healthy',
        latency: Date.now() - questdbStart,
      };
    } else {
      overallStatus = 'unhealthy';
      services.questdb = {
        status: 'unhealthy',
        latency: Date.now() - questdbStart,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error('QuestDB health check failed:', error);
    overallStatus = 'unhealthy';
    services.questdb = {
      status: 'unhealthy',
      latency: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown QuestDB connection error',
    };
  }

  if (process.env.REDIS_URL) {
    const redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });

    try {
      const redisStart = Date.now();
      await redis.connect();
      await redis.ping();
      services.cache = {
        status: 'healthy',
        latency: Date.now() - redisStart,
        enabled: true,
        strategy: 'explicit',
        ttl: 300,
      };
      await redis.quit();
    } catch (error) {
      console.error('Redis health check failed:', error);
      overallStatus = 'unhealthy';
      services.cache = {
        status: 'unhealthy',
        latency: 0,
        enabled: true,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown Redis connection error',
      };
      try {
        await redis.quit();
      } catch {
        console.error('Failed to quit Redis connection:', error);
      }
    }
  } else {
    services.cache = {
      status: 'unknown',
      latency: 0,
      enabled: false,
    };
  }

  const totalLatency = Date.now() - startTime;

  const data: HealthCheckData = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    status: overallStatus,
    services,
    responseTime: totalLatency,
  };

  return c.json(data, HttpStatus.OK);
});

export default health;
