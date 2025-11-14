'use client';

import {
  AddSquareIcon,
  ArrowRight01Icon,
  ArtboardIcon,
  UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type App = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get('app');
  const [, setAppId] = useQueryState('app');

  const apps: App[] = useMemo(
    () => [
      { id: '1', name: 'Artover' },
      { id: '2', name: 'Telemetra' },
    ],
    []
  );

  const _selectedApp = apps.find((app) => app.id === appId);

  useEffect(() => {
    if (appId) {
      router.replace(`/dashboard/analytics/overview?app=${appId}`);
    } else {
      const lastAppId =
        typeof window !== 'undefined'
          ? localStorage.getItem('lastSelectedApp')
          : null;

      if (lastAppId) {
        router.replace(`/dashboard/analytics/overview?app=${lastAppId}`);
      }
    }
  }, [appId, router]);

  if (appId) {
    return null;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-bold text-3xl">Welcome to Telemetra</h1>
          <p className="mt-2 text-muted-foreground">
            Select an app to get started with analytics
          </p>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-14 items-center gap-3 rounded-lg border bg-background px-4 shadow-sm transition-colors hover:bg-accent"
              type="button"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HugeiconsIcon className="size-5" icon={ArtboardIcon} />
              </div>
              <div className="flex flex-col items-start gap-0.5 leading-none">
                <span className="font-semibold text-sm">Select an App</span>
                <span className="text-muted-foreground text-xs">
                  Choose from your applications
                </span>
              </div>
              <HugeiconsIcon className="ml-2 size-4" icon={UnfoldMoreIcon} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56" side="bottom">
            <DropdownMenuLabel>Switch App</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {apps.map((app) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => {
                  setAppId(app.id);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('lastSelectedApp', app.id);
                  }
                  router.push(`/dashboard/analytics/overview?app=${app.id}`);
                }}
              >
                {app.name}
                <HugeiconsIcon
                  className="ml-auto size-4"
                  icon={ArrowRight01Icon}
                />
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="success">
              <HugeiconsIcon className="mr-2 size-4" icon={AddSquareIcon} />
              Create New App
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
