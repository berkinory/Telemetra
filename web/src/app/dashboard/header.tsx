'use client';

import {
  DashboardSquare01Icon,
  Home01Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';
import { type ReactNode, useEffect, useState } from 'react';
import type { CommandItem } from '@/components/command-menu';
import { CommandMenu, CommandMenuTrigger } from '@/components/command-menu';
import { ThemeTogglerButton } from '@/components/theme-toggler';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: '1',
    name: 'Home',
    icon: Home01Icon,
    keywords: ['home', 'dashboard', 'main'],
    path: '/dashboard',
  },
  {
    id: '2',
    name: 'Dashboard',
    icon: DashboardSquare01Icon,
    keywords: ['dashboard', 'overview', 'stats'],
    path: '/dashboard',
  },
  {
    id: '3',
    name: 'Settings',
    icon: Settings01Icon,
    keywords: ['settings', 'preferences', 'config'],
    path: '/dashboard/settings',
  },
  {
    id: '4',
    name: 'Logout',
    icon: Settings01Icon,
    keywords: ['logout', 'exit', 'sign out'],
    path: '/logout',
  },
  {
    id: '5',
    name: 'Help',
    icon: Settings01Icon,
    keywords: ['help', 'support', 'faq'],
    path: '/dashboard/help',
  },
  {
    id: '6',
    name: 'About',
    icon: Settings01Icon,
    keywords: ['about', 'information', 'version'],
    path: '/dashboard/about',
  },
  {
    id: '7',
    name: 'Feedback',
    icon: Settings01Icon,
    keywords: ['feedback', 'suggestions', 'report'],
    path: '/dashboard/feedback',
  },
  {
    id: '8',
    name: 'Contact',
    icon: Settings01Icon,
    keywords: ['contact', 'support', 'email'],
    path: '/dashboard/contact',
  },
];

export function DashboardHeader({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2"> </div>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <CommandMenuTrigger onClick={() => setCommandMenuOpen(true)} />
            )}
            <ThemeTogglerButton />
          </div>
        </div>
      </header>
      {!isMobile && (
        <CommandMenu
          items={COMMAND_ITEMS}
          onOpenChange={setCommandMenuOpen}
          open={commandMenuOpen}
        />
      )}
      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    </>
  );
}
