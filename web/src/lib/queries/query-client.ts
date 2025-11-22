import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      staleTime: 1 * 60_000,
      gcTime: 20 * 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const cacheConfig = {
  realtime: {
    staleTime: 0,
    gcTime: 5 * 60_000,
    refetchInterval: 30_000,
  },
  overview: {
    staleTime: 1 * 60_000,
    gcTime: 20 * 60_000,
  },
  list: {
    staleTime: 1 * 60_000,
    gcTime: 20 * 60_000,
  },
  detail: {
    staleTime: 1 * 60_000,
    gcTime: 20 * 60_000,
  },
  static: {
    staleTime: 5 * 60_000,
    gcTime: 40 * 60_000,
  },
  timeseries: {
    staleTime: 2 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  },
} as const;
