'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CountingNumber } from '@/components/ui/counting-number';
import { useAdminStats } from '@/lib/queries/use-admin';

export function AdminOverviewCards() {
  const { data: stats } = useAdminStats();

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="py-0">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs uppercase">Total Users</p>
          <p className="font-bold text-3xl">
            <CountingNumber number={stats?.totalUsers || 0} />
          </p>
          <p className="mt-1 text-muted-foreground text-xs">Registered users</p>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs uppercase">Total Apps</p>
          <p className="font-bold text-3xl">
            <CountingNumber number={stats?.totalApps || 0} />
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Created applications
          </p>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs uppercase">
            Total Devices
          </p>
          <p className="font-bold text-3xl">
            <CountingNumber number={stats?.totalDevices || 0} />
          </p>
          <p className="mt-1 text-muted-foreground text-xs">Tracked devices</p>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs uppercase">
            Total Sessions
          </p>
          <p className="font-bold text-3xl">
            <CountingNumber number={stats?.totalSessions || 0} />
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Analytics sessions
          </p>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-xs uppercase">
            Total Events
          </p>
          <p className="font-bold text-3xl">
            <CountingNumber number={stats?.totalEvents || 0} />
          </p>
          <p className="mt-1 text-muted-foreground text-xs">Recorded events</p>
        </CardContent>
      </Card>
    </div>
  );
}
