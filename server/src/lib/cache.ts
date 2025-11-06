import { deserialize, serialize } from 'node:v8';
import type { Table } from 'drizzle-orm';
import { Cache } from 'drizzle-orm/cache/core';
import Redis from 'ioredis';

type CacheConfig = {
  ex?: number;
  px?: number;
};

type CacheData = {
  value: unknown;
  tables: string[];
};

type MutationOption = {
  tables?: string | string[] | Table | Table[];
  tags?: string | string[];
};

export class RedisCache extends Cache {
  private readonly redis: Redis;
  private readonly config: CacheConfig;
  private readonly tableKeysMap: Map<string, Set<string>> = new Map();

  constructor(redisUrl: string, config: CacheConfig = {}) {
    super();
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
    this.config = config;
  }

  strategy(): 'explicit' | 'all' {
    return 'explicit';
  }

  // biome-ignore lint/suspicious/noExplicitAny: Drizzle cache API requires any[]
  async get(key: string): Promise<any[] | undefined> {
    try {
      const cached = await this.redis.getBuffer(key);
      if (!cached) {
        return;
      }

      const data = deserialize(cached) as CacheData;
      // biome-ignore lint/suspicious/noExplicitAny: Drizzle cache API requires any[]
      return data.value as any[];
    } catch (error) {
      console.error('[RedisCache] Get error:', error);
      return;
    }
  }

  async put(key: string, value: unknown, tables: string[]): Promise<void> {
    try {
      const data: CacheData = { value, tables };
      const serialized = serialize(data);

      if (this.config.ex) {
        await this.redis.setex(key, this.config.ex, serialized);
      } else if (this.config.px) {
        await this.redis.psetex(key, this.config.px, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      for (const table of tables) {
        if (!this.tableKeysMap.has(table)) {
          this.tableKeysMap.set(table, new Set());
        }
        this.tableKeysMap.get(table)?.add(key);
      }
    } catch (error) {
      console.error('[RedisCache] Put error:', error);
    }
  }

  async onMutate(params: MutationOption): Promise<void> {
    try {
      if (!params.tables) {
        return;
      }

      const tables = Array.isArray(params.tables)
        ? params.tables
        : [params.tables];

      for (const table of tables) {
        const tableName = typeof table === 'string' ? table : table._.name;
        const keys = this.tableKeysMap.get(tableName);

        if (!keys || keys.size === 0) {
          continue;
        }

        const pipeline = this.redis.pipeline();
        for (const key of keys) {
          pipeline.del(key);
        }
        const results = await pipeline.exec();

        if (results) {
          let i = 0;
          for (const key of keys) {
            const result = results[i++];
            if (result && !result[0]) {
              keys.delete(key);
            }
          }
        }

        if (keys.size === 0) {
          this.tableKeysMap.delete(tableName);
        }
      }
    } catch (error) {
      console.error('[RedisCache] OnMutate error:', error);
    }
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}

export function redisCache(
  redisUrl: string,
  config: CacheConfig = {}
): RedisCache {
  return new RedisCache(redisUrl, config);
}
