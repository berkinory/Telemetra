'use client';

import { RealtimeActivityFeed } from '@/components/realtime/realtime-activity-feed';
import { RequireApp } from '@/components/require-app';

export default function RealtimePage() {
  return (
    <RequireApp>
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="font-bold text-2xl">Realtime</h1>
          <p className="text-muted-foreground text-sm">
            Monitor real-time activity in your application
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <RealtimeActivityFeed />
          </div>
        </div>
      </div>
    </RequireApp>
  );
}
