import { useQuery } from '@tanstack/react-query';
import { buildQueryString, fetchApi } from '@/lib/api/client';
import type {
  DeviceDetail,
  DeviceLive,
  DeviceOverview,
  DevicesListResponse,
  PaginationParams,
} from '../api/types';
import { cacheConfig } from './query-client';
import { queryKeys } from './query-keys';

type DeviceFilters = PaginationParams & {
  platform?: string;
  startDate?: string;
  endDate?: string;
};

export function useDevices(appId: string, filters?: DeviceFilters) {
  return useQuery({
    queryKey: queryKeys.devices.list(appId, filters),
    queryFn: () =>
      fetchApi<DevicesListResponse>(
        `/web/devices${buildQueryString({ appId, ...filters })}`
      ),
    ...cacheConfig.list,
    enabled: Boolean(appId),
  });
}

export function useDevice(deviceId: string, appId: string) {
  return useQuery({
    queryKey: queryKeys.devices.detail(deviceId, appId),
    queryFn: () =>
      fetchApi<DeviceDetail>(
        `/web/devices/${deviceId}${buildQueryString({ appId })}`
      ),
    ...cacheConfig.detail,
    enabled: Boolean(deviceId && appId),
  });
}

export function useDeviceOverview(appId: string) {
  return useQuery({
    queryKey: queryKeys.devices.overview(appId),
    queryFn: () =>
      fetchApi<DeviceOverview>(
        `/web/devices/overview${buildQueryString({ appId })}`
      ),
    ...cacheConfig.overview,
    enabled: Boolean(appId),
  });
}

export function useDeviceLive(appId: string) {
  return useQuery({
    queryKey: queryKeys.devices.live(appId),
    queryFn: () =>
      fetchApi<DeviceLive>(`/web/devices/live${buildQueryString({ appId })}`),
    ...cacheConfig.realtime,
    enabled: Boolean(appId),
  });
}
