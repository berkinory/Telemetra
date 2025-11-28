'use client';

import { ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
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

function getColumns(appId: string): ColumnDef<Event>[] {
  return [
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
      size: 300,
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
      header: 'Time',
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
    {
      id: 'actions',
      header: '',
      size: 50,
      minSize: 50,
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center justify-center">
          <Link
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={`/dashboard/analytics/events/${row.original.eventId}?app=${appId}`}
          >
            <HugeiconsIcon className="size-4" icon={ViewIcon} />
          </Link>
        </div>
      ),
    },
  ];
}

export function EventsTable() {
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
      columns={getColumns(appId)}
      data={eventsData?.events || []}
      isLoading={false}
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
