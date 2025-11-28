'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DataTableServer } from '@/components/ui/data-table-server';
import { formatDateTime } from '@/lib/date-utils';
import { useEvents } from '@/lib/queries';
import { usePaginationStore } from '@/stores/pagination-store';

type Event = {
  eventId: string;
  name: string;
  deviceId: string;
  timestamp: string;
};

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'name',
    header: 'Event Name',
    size: 300,
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate font-medium text-sm lg:max-w-sm"
        title={row.getValue('name')}
      >
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'deviceId',
    header: 'User ID',
    size: 350,
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate font-mono text-xs lg:max-w-sm"
        title={row.getValue('deviceId')}
      >
        {row.getValue('deviceId')}
      </div>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'Date',
    size: 200,
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as string;
      return (
        <span className="text-muted-foreground text-xs">
          {formatDateTime(timestamp)}
        </span>
      );
    },
  },
];

export function EventsTable() {
  const router = useRouter();
  const [appId] = useQueryState('app', parseAsString);
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const { pageSize } = usePaginationStore();

  const { data: eventsData } = useEvents(appId || '', {
    page: page.toString(),
    pageSize: pageSize.toString(),
    eventName: search || undefined,
  });

  if (!appId) {
    return null;
  }

  return (
    <DataTableServer
      columns={columns}
      data={eventsData?.events || []}
      isLoading={false}
      onRowClick={(row) => {
        router.push(`/dashboard/analytics/events/${row.eventId}?app=${appId}`);
      }}
      pagination={
        eventsData?.pagination || {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        }
      }
      searchKey="name"
      searchPlaceholder="Search events"
    />
  );
}
