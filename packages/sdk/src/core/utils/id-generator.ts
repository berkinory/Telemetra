import { monotonicFactory } from 'ulidx';

const ulid = monotonicFactory(Math.random);

export function generateDeviceId(): string {
  return ulid();
}

export function generateSessionId(): string {
  return ulid();
}
