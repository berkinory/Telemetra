import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminOverviewCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {Array.from({ length: 5 }, (_, i) => `admin-stat-skeleton-${i}`).map(
        (key) => (
          <Card className="py-0" key={key}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="mb-1 h-9 w-16" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

export function AdminUsersTableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="space-y-2">
        {Array.from(
          { length: 10 },
          (_, i) => `admin-user-row-skeleton-${i}`
        ).map((key) => (
          <Skeleton className="h-12 w-full" key={key} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}
