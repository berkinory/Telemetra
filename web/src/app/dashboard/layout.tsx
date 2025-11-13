'use client';

import {
  Analytics01Icon,
  ArtboardIcon,
  ChartLineData01Icon,
  Database01Icon,
  File01Icon,
  Notification01Icon,
  Search01Icon,
  Settings02Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { ThemeTogglerButton } from '@/components/theme-toggler';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: ArtboardIcon,
    url: '/dashboard',
    isActive: true,
  },
  {
    title: 'Analytics',
    icon: Analytics01Icon,
    url: '/dashboard/analytics',
    badge: '12',
  },
  {
    title: 'Events',
    icon: ChartLineData01Icon,
    url: '/dashboard/events',
  },
  {
    title: 'Sessions',
    icon: Database01Icon,
    url: '/dashboard/sessions',
  },
];

const projectItems = [
  {
    title: 'Project Alpha',
    url: '/dashboard/projects/alpha',
  },
  {
    title: 'Project Beta',
    url: '/dashboard/projects/beta',
  },
  {
    title: 'Project Gamma',
    url: '/dashboard/projects/gamma',
  },
];

const settingsItems = [
  {
    title: 'General',
    url: '/dashboard/settings',
  },
  {
    title: 'Team',
    url: '/dashboard/settings/team',
  },
  {
    title: 'Billing',
    url: '/dashboard/settings/billing',
  },
  {
    title: 'API Keys',
    url: '/dashboard/settings/api',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SidebarProvider>
      <Sidebar animateOnHover={false} collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Telemetra">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon className="size-4" icon={ArtboardIcon} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Telemetra</span>
                  <span className="text-sidebar-foreground/70 text-xs">
                    Analytics Platform
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 py-1">
            <div className="relative">
              <HugeiconsIcon
                className="-translate-y-1/2 absolute top-1/2 left-2 size-4 text-sidebar-foreground/50"
                icon={Search01Icon}
              />
              <Input
                className="h-8 pl-8"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                value={searchQuery}
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                    >
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <span className="text-lg">+</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <HugeiconsIcon icon={File01Icon} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>
                      <span className="text-xs">⋯</span>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <HugeiconsIcon icon={Settings02Icon} />
                    <span>Settings</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {settingsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton>
                          <span>{item.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" tooltip="User Menu">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                        BK
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold text-sm">Berk</span>
                      <span className="text-sidebar-foreground/70 text-xs">
                        berk@example.com
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56" side="top">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HugeiconsIcon className="mr-2 size-4" icon={User02Icon} />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      className="mr-2 size-4"
                      icon={Settings02Icon}
                    />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      className="mr-2 size-4"
                      icon={Notification01Icon}
                    />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeTogglerButton />
              <Button size="icon" variant="ghost">
                <HugeiconsIcon icon={Notification01Icon} />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
