import { useMutation, useQuery } from '@tanstack/react-query';
import { buildQueryString, fetchApi } from '@/lib/api/client';
import type {
  AppCreated,
  AppKeysResponse,
  AppsListResponse,
  AppTeamResponse,
  CreateAppRequest,
} from '@/lib/api/types';
import { cacheConfig, queryClient } from './query-client';
import { queryKeys } from './query-keys';

export function useApps() {
  return useQuery({
    queryKey: queryKeys.apps.list(),
    queryFn: () => fetchApi<AppsListResponse>('/web/apps'),
    ...cacheConfig.static,
  });
}

export function useAppKeys(appId: string) {
  return useQuery({
    queryKey: queryKeys.apps.keys(appId),
    queryFn: () => fetchApi<AppKeysResponse>(`/web/apps/${appId}/keys`),
    ...cacheConfig.static,
    enabled: Boolean(appId),
  });
}

export function useAppTeam(appId: string) {
  return useQuery({
    queryKey: queryKeys.apps.team(appId),
    queryFn: () => fetchApi<AppTeamResponse>(`/web/apps/${appId}/team`),
    ...cacheConfig.detail,
    enabled: Boolean(appId),
  });
}

export function useCreateApp() {
  return useMutation({
    mutationFn: (data: CreateAppRequest) =>
      fetchApi<AppCreated>('/web/apps', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apps.all });
    },
  });
}

