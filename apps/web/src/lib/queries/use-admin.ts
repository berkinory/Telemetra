import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api/client';
import type { AdminStatsResponse, AdminUsersResponse } from '@/lib/api/types';
import { useSession } from '@/lib/auth';
import { cacheConfig } from './query-client';
import { queryKeys } from './query-keys';

const ADMIN_USER_ID = 'C28lEs9hf2vqiFyQDJ8JmPx4HQvQimGl';

export function useIsAdmin() {
  const { data: session } = useSession();
  return session?.user?.id === ADMIN_USER_ID;
}

export function useAdminStats() {
  const { data: session } = useSession();
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: () => fetchApi<AdminStatsResponse>('/web/admin/stats'),
    ...cacheConfig.overview,
    enabled: !!session && isAdmin,
  });
}

export function useAdminUsers() {
  const { data: session } = useSession();
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => fetchApi<AdminUsersResponse>('/web/admin/users'),
    ...cacheConfig.list,
    enabled: !!session && isAdmin,
  });
}
