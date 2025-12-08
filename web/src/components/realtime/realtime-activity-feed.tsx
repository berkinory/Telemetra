'use client';

import {
  ComputerPhoneSyncIcon,
  CursorPointer02Icon,
  GpsSignal01Icon,
  PlaySquareIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMemo } from 'react';
import 'flag-icons/css/flag-icons.min.css';
import type { ActivityItem } from '@/app/dashboard/analytics/realtime/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGeneratedName, UserAvatar } from '@/components/user-profile';

const COUNTRY_CODE_REGEX = /^[A-Za-z]{2}$/;

function getCountryLabel(countryCode: string) {
  return (
    new Intl.DisplayNames(['en'], {
      type: 'region',
    }).of(countryCode) || countryCode
  );
}

function getPlatformIcon(platform: string | null) {
  switch (platform) {
    case 'android':
      return (
        <svg
          aria-label="Android"
          className="size-4"
          fill="currentColor"
          role="img"
          viewBox="0 0 24 24"
        >
          <title>Android</title>
          <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396z" />
        </svg>
      );
    case 'ios':
      return (
        <svg
          aria-label="iOS"
          className="size-4"
          fill="currentColor"
          role="img"
          viewBox="0 0 24 24"
        >
          <title>iOS</title>
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      );
    case 'web':
      return (
        <svg
          aria-label="Web"
          className="size-4"
          fill="currentColor"
          role="img"
          viewBox="0 0 24 24"
        >
          <title>Web</title>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    default:
      return null;
  }
}

type RealtimeActivityFeedProps = {
  activities: ActivityItem[];
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
};

function getStatusColor(
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
): string {
  if (status === 'connected') {
    return 'bg-green-500';
  }
  if (status === 'connecting') {
    return 'animate-pulse bg-yellow-500';
  }
  if (status === 'error') {
    return 'bg-red-500';
  }
  return 'bg-gray-500';
}

function getStatusMessage(
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
): string {
  if (status === 'connected') {
    return 'Listening to your app';
  }
  if (status === 'connecting') {
    return 'Connecting...';
  }
  if (status === 'error') {
    return 'Connection error';
  }
  return 'Disconnected';
}

export function RealtimeActivityFeed({
  activities,
  status,
}: RealtimeActivityFeedProps) {
  const displayActivities = useMemo(
    () => activities.slice(0, 50),
    [activities]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Feed</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`size-2 rounded-full ${getStatusColor(status)}`} />
            <span className="text-muted-foreground text-xs capitalize">
              {status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {displayActivities.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <HugeiconsIcon
                  className="size-10 text-muted-foreground opacity-40"
                  icon={GpsSignal01Icon}
                />
                <p className="text-center font-medium text-muted-foreground text-sm">
                  {getStatusMessage(status)}
                </p>
              </div>
            )}

            {displayActivities.map((activity) => (
              <div
                className="cursor-pointer space-y-2 rounded-lg border p-3 transition-colors hover:bg-accent"
                key={activity.id}
              >
                <div className="flex items-center gap-2">
                  {activity.type === 'event' && (
                    <HugeiconsIcon
                      className="size-4 text-muted-foreground"
                      icon={CursorPointer02Icon}
                    />
                  )}
                  {activity.type === 'session' && (
                    <HugeiconsIcon
                      className="size-4 text-muted-foreground"
                      icon={PlaySquareIcon}
                    />
                  )}
                  {activity.type === 'device' && (
                    <HugeiconsIcon
                      className="size-4 text-muted-foreground"
                      icon={ComputerPhoneSyncIcon}
                    />
                  )}
                  <span className="font-medium text-sm">{activity.name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <UserAvatar
                    seed={activity.deviceId}
                    size={16}
                    variant="marble"
                  />
                  <span className="text-muted-foreground">
                    {getGeneratedName(activity.deviceId)}
                  </span>
                  {activity.country &&
                    activity.country.length === 2 &&
                    COUNTRY_CODE_REGEX.test(activity.country) && (
                      <>
                        <span className="text-primary">from</span>
                        <span
                          className={`fi fi-${activity.country.toLowerCase()} rounded-xs text-[14px]`}
                          title={getCountryLabel(activity.country)}
                        />
                      </>
                    )}
                  {activity.platform && (
                    <>
                      <span className="text-primary">with</span>
                      <div className="text-foreground">
                        {getPlatformIcon(activity.platform)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
