import { useQuery } from '@tanstack/react-query';
import { buildQueryString, fetchApi } from '@/lib/api/client';
import type {
  DateRangeParams,
  EventDetail,
  EventOverview,
  EventsListResponse,
  PaginationParams,
  TopEventsResponse,
} from '@/lib/api/types';
import { cacheConfig } from './query-client';
import { queryKeys } from './query-keys';

type EventFilters = PaginationParams & {
  eventName?: string;
  sessionId?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
};

export function useEvents(appId: string, filters?: EventFilters) {
  return useQuery({
    queryKey: queryKeys.events.list(appId, filters),
    queryFn: () =>
      fetchApi<EventsListResponse>(
        `/web/events${buildQueryString({ ...filters, appId })}`
      ),
    ...cacheConfig.list,
    enabled: Boolean(appId),
  });
}

export function useEvent(eventId: string, appId: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId, appId),
    queryFn: () =>
      fetchApi<EventDetail>(`/web/events/${eventId}?appId=${appId}`),
    ...cacheConfig.detail,
    enabled: Boolean(eventId && appId),
  });
}

export function useEventOverview(appId: string) {
  return useQuery({
    queryKey: queryKeys.events.overview(appId),
    queryFn: () =>
      fetchApi<EventOverview>(`/web/events/overview?appId=${appId}`),
    ...cacheConfig.overview,
    enabled: Boolean(appId),
  });
}

export function useTopEvents(appId: string, dateRange?: DateRangeParams) {
  return useQuery({
    queryKey: queryKeys.events.top(appId, dateRange),
    queryFn: () =>
      fetchApi<TopEventsResponse>(
        `/web/events/top${buildQueryString({ ...dateRange, appId })}`
      ),
    ...cacheConfig.overview,
    enabled: Boolean(appId),
  });
}
