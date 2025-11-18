import { useQuery } from '@tanstack/react-query';
import { buildQueryString, fetchApi } from '@/lib/api/client';
import type {
  PaginationParams,
  SessionOverview,
  SessionsListResponse,
} from '@/lib/api/types';
import { cacheConfig } from './query-client';
import { queryKeys } from './query-keys';

type SessionFilters = PaginationParams & {
  startDate?: string;
  endDate?: string;
};

export function useSessions(
  deviceId: string,
  appId: string,
  filters?: SessionFilters
) {
  return useQuery({
    queryKey: queryKeys.sessions.list(appId, deviceId, filters),
    queryFn: () =>
      fetchApi<SessionsListResponse>(
        `/web/sessions${buildQueryString({ deviceId, appId, ...filters })}`
      ),
    ...cacheConfig.list,
    enabled: Boolean(deviceId && appId),
  });
}

export function useSessionOverview(appId: string) {
  return useQuery({
    queryKey: queryKeys.sessions.overview(appId),
    queryFn: () =>
      fetchApi<SessionOverview>(
        `/web/sessions/overview${buildQueryString({ appId })}`
      ),
    ...cacheConfig.overview,
    enabled: Boolean(appId),
  });
}
