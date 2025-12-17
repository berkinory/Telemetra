import { ulid } from 'ulidx';

export function generateDeviceId(): string {
  return ulid();
}

export function generateSessionId(): string {
  return ulid();
}
