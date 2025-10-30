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
