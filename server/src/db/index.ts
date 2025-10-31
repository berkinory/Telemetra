import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  account,
  apikey,
  devices,
  events,
  session,
  sessions,
  user,
  verification,
} from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
  statement_timeout: 30_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('[Database] Unexpected error on idle client:', error);
});

const schema = {
  user,
  session,
  account,
  verification,
  apikey,
  devices,
  sessions,
  events,
};

export const db = drizzle({ client: pool, schema });

export { pool };

export {
  account,
  apikey,
  devices,
  events,
  session,
  sessions,
  user,
  verification,
} from './schema';
