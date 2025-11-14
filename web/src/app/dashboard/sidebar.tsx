'use client';

import {
  AddSquareIcon,
  Analytics01Icon,
  ArrowRight01Icon,
  ArtboardIcon,
  Blockchain05Icon,
  BubbleChatIcon,
  ChatEditIcon,
  ComputerPhoneSyncIcon,
  CreditCardIcon,
  File02Icon,
  GithubIcon,
  Key01Icon,
  Logout01Icon,
  PlaySquareIcon,
  Setting07Icon,
  UnfoldMoreIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { minidenticon } from 'minidenticons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

type App = {
  id: string;
  name: string;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  const username = 'berk@example.com';

  const apps: App[] = useMemo(
    () => [
      { id: '1', name: 'Artover' },
      { id: '2', name: 'Telemetra' },
    ],
    []
  );

  useEffect(() => {
    const pathParts = pathname.split('/');
    const appIdFromUrl = pathParts.at(-1);

    if (apps.some((app) => app.id === appIdFromUrl)) {
      setSelectedAppId(appIdFromUrl ?? null);
    }

    setIsLoadingApp(false);
  }, [pathname, apps]);

  const selectedApp = apps.find((app) => app.id === selectedAppId);

  const generatedAvatar = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        minidenticon(username, 55, 45)
      )}`,
    []
  );

  useEffect(() => {
    setAvatarSrc(generatedAvatar);
  }, [generatedAvatar]);

  return (
    <Sidebar
      animateOnHover={false}
      collapsible="icon"
      side="left"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={selectedApp ? selectedApp.name : 'Select an App'}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <HugeiconsIcon className="size-4" icon={ArtboardIcon} />
                  </div>
                  {isLoadingApp ? (
                    <div className="flex flex-col gap-1 leading-none">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">
                        {selectedApp ? selectedApp.name : 'Select an App'}
                      </span>
                      <span className="text-sidebar-foreground/70 text-xs">
                        {selectedApp ? 'Analytics' : 'No app selected'}
                      </span>
                    </div>
                  )}
                  <HugeiconsIcon
                    className="ml-auto size-4"
                    icon={UnfoldMoreIcon}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56" side="bottom">
                <DropdownMenuLabel>Switch App</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {apps.map((app) => (
                  <DropdownMenuItem
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      router.push(`/dashboard/${app.id}`);
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild isActive tooltip="Overview">
                    <Link
                      href={`/dashboard/analytics/overview/${selectedAppId}`}
                    >
                      <HugeiconsIcon icon={Analytics01Icon} />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Overview">
                    <HugeiconsIcon icon={Analytics01Icon} />
                    <span>Overview</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Users">
                    <Link href={`/dashboard/analytics/users/${selectedAppId}`}>
                      <HugeiconsIcon icon={ComputerPhoneSyncIcon} />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Users">
                    <HugeiconsIcon icon={ComputerPhoneSyncIcon} />
                    <span>Users</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Sessions">
                    <Link
                      href={`/dashboard/analytics/sessions/${selectedAppId}`}
                    >
                      <HugeiconsIcon icon={PlaySquareIcon} />
                      <span>Sessions</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Sessions">
                    <HugeiconsIcon icon={PlaySquareIcon} />
                    <span>Sessions</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Events">
                    <Link href={`/dashboard/analytics/events/${selectedAppId}`}>
                      <HugeiconsIcon icon={Blockchain05Icon} />
                      <span>Events</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Events">
                    <HugeiconsIcon icon={Blockchain05Icon} />
                    <span>Events</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Feedbacks">
                    <Link
                      href={`/dashboard/reports/feedbacks/${selectedAppId}`}
                    >
                      <HugeiconsIcon icon={ChatEditIcon} />
                      <span>Feedbacks</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Feedbacks">
                    <HugeiconsIcon icon={ChatEditIcon} />
                    <span>Feedbacks</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link
                      href={`/dashboard/application/settings/${selectedAppId}`}
                    >
                      <HugeiconsIcon icon={Setting07Icon} />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Settings">
                    <HugeiconsIcon icon={Setting07Icon} />
                    <span>Settings</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="API Keys">
                    <Link
                      href={`/dashboard/application/api-keys/${selectedAppId}`}
                    >
                      <HugeiconsIcon icon={Key01Icon} />
                      <span>API Keys</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="API Keys">
                    <HugeiconsIcon icon={Key01Icon} />
                    <span>API Keys</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {selectedAppId ? (
                  <SidebarMenuButton asChild tooltip="Team">
                    <Link href={`/dashboard/application/team/${selectedAppId}`}>
                      <HugeiconsIcon icon={UserGroupIcon} />
                      <span>Team</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton disabled tooltip="Team">
                    <HugeiconsIcon icon={UserGroupIcon} />
                    <span>Team</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Docs">
              <HugeiconsIcon icon={File02Icon} />
              <span>Docs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support">
              <HugeiconsIcon icon={BubbleChatIcon} />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Github">
              <HugeiconsIcon icon={GithubIcon} />
              <span>Github</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip="Account">
                  <Avatar className="size-8">
                    {avatarSrc && (
                      <AvatarImage
                        alt={username}
                        className={`transition-opacity duration-300 ${
                          isAvatarLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setIsAvatarLoaded(true)}
                        src={avatarSrc}
                      />
                    )}
                    <AvatarFallback className="bg-transparent" />
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sm">Berk</span>
                    <span className="text-sidebar-foreground/70 text-xs">
                      {username}
                    </span>
                  </div>
                  <HugeiconsIcon
                    className="ml-auto size-4"
                    icon={UnfoldMoreIcon}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56" side="top">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon
                    className="mr-2 size-4"
                    icon={CreditCardIcon}
                  />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon className="mr-2 size-4" icon={Logout01Icon} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
