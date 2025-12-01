import { t } from 'elysia';

const ServiceStatusSchema = t.Object({
  status: t.Union([
    t.Literal('healthy'),
    t.Literal('unhealthy'),
    t.Literal('unknown'),
  ]),
  latency: t.Number(),
  error: t.Optional(t.String()),
  message: t.Optional(t.String()),
});

const CacheServiceStatusSchema = t.Composite([
  ServiceStatusSchema,
  t.Object({
    enabled: t.Boolean(),
    strategy: t.Optional(t.String()),
    ttl: t.Optional(t.Number()),
  }),
]);

export const HealthResponseSchema = t.Object({
  timestamp: t.String({ format: 'date-time' }),
  uptime: t.Number(),
  status: t.Union([t.Literal('healthy'), t.Literal('unhealthy')]),
  services: t.Object({
    database: ServiceStatusSchema,
    questdb: ServiceStatusSchema,
    cache: CacheServiceStatusSchema,
  }),
  responseTime: t.Number(),
});

export type HealthResponse = typeof HealthResponseSchema.static;

export type ServiceStatus = {
  status: 'healthy' | 'unhealthy' | 'unknown';
  latency: number;
  error?: string;
  message?: string;
};

export type CacheServiceStatus = ServiceStatus & {
  enabled: boolean;
  strategy?: string;
  ttl?: number;
};
