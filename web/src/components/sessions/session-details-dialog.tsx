'use client';

import { FolderSearchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buildQueryString, fetchApi } from '@/lib/api/client';
import type {
  EventListItem,
  EventsListResponse,
  Session,
} from '@/lib/api/types';
import { formatDateTime } from '@/lib/date-utils';
import { cacheConfig } from '@/lib/queries/query-client';
import { queryKeys } from '@/lib/queries/query-keys';

function formatDuration(startedAt: string, lastActivityAt: string) {
  const start = new Date(startedAt).getTime();
  const end = new Date(lastActivityAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return '—';
  }

  const seconds = Math.floor((end - start) / 1000);

  if (seconds < 0) {
    return '—';
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

const columns: ColumnDef<EventListItem>[] = [
  {
    accessorKey: 'name',
    header: 'Event Name',
    size: 400,
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
    accessorKey: 'timestamp',
    header: 'Date',
    size: 250,
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as string;
      return (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(timestamp)}
        </span>
      );
    },
  },
];

type SessionDetailsDialogProps = {
  session: Session | null;
  appId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SessionDetailsDialog({
  session,
  appId,
  open,
  onOpenChange,
}: SessionDetailsDialogProps) {
  const router = useRouter();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: queryKeys.events.list(appId, { sessionId: session?.sessionId }),
    queryFn: () => {
      if (!(session?.sessionId && appId)) {
        return Promise.resolve({
          events: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        });
      }
      return fetchApi<EventsListResponse>(
        `/web/events${buildQueryString({ sessionId: session.sessionId, appId })}`
      );
    },
    enabled: open && Boolean(session?.sessionId && appId),
    ...cacheConfig.list,
  });

  const table = useReactTable({
    data: eventsData?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!session) {
    return null;
  }

  const duration = formatDuration(session.startedAt, session.lastActivityAt);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle>Session Details</DialogTitle>
          <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">User ID</p>
              <p className="break-all font-mono text-sm">{session.deviceId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">Started At</p>
              <p className="text-sm">{formatDateTime(session.startedAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">Duration</p>
              <p className="text-sm">{duration}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              Events ({eventsData?.events.length || 0})
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <TableHead
                          className={`bg-muted/50 font-semibold ${
                            index < headerGroup.headers.length - 1
                              ? 'border-border border-r'
                              : ''
                          }`}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading &&
                    Array.from({ length: 5 }).map((__, rowIndex) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton rows are static and don't reorder
                      <TableRow key={`loading-row-${rowIndex}`}>
                        {columns.map((column, colIndex) => (
                          <TableCell
                            className={
                              colIndex < columns.length - 1
                                ? 'border-border border-r'
                                : ''
                            }
                            key={`loading-${rowIndex}-${column.id || colIndex}`}
                          >
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!isLoading &&
                    table.getRowModel().rows?.length > 0 &&
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        className="cursor-pointer"
                        key={row.id}
                        onClick={() => {
                          router.push(
                            `/dashboard/analytics/events/${row.original.eventId}?app=${appId}`
                          );
                        }}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell
                            className={
                              index < row.getVisibleCells().length - 1
                                ? 'border-border border-r'
                                : ''
                            }
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!isLoading &&
                    (!table.getRowModel().rows ||
                      table.getRowModel().rows.length === 0) && (
                      <TableRow>
                        <TableCell
                          className="h-32 text-center"
                          colSpan={columns.length}
                        >
                          <div className="flex flex-col items-center justify-center gap-2 py-4">
                            <HugeiconsIcon
                              className="size-10 text-muted-foreground opacity-40"
                              icon={FolderSearchIcon}
                            />
                            <div className="flex flex-col gap-1">
                              <p className="font-medium text-muted-foreground text-sm">
                                No events found
                              </p>
                              <p className="text-muted-foreground text-xs">
                                This session has no recorded events
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
