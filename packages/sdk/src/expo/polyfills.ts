import { getRandomValues } from 'expo-crypto';

type GlobalWithCrypto = {
  crypto?: {
    getRandomValues?: (array: Uint8Array) => Uint8Array;
  };
};

const g = globalThis as unknown as GlobalWithCrypto;

if (typeof g.crypto !== 'object') {
  g.crypto = {};
}

if (typeof g.crypto.getRandomValues !== 'function') {
  g.crypto.getRandomValues = getRandomValues;
}
