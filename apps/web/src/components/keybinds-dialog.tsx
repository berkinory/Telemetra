'use client';

import { KeyboardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getModifierKey } from '@/lib/platform';

type Keybind = {
  id: string;
  keys: string[];
  description: string;
};

export function KeybindsDialog() {
  const [modKey, setModKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setModKey(getModifierKey());
  }, []);

  const keybinds: Keybind[] = [
    {
      id: 'command-menu',
      keys: [modKey ?? 'Ctrl', 'K'],
      description: 'Open command menu',
    },
    {
      id: 'toggle-sidebar',
      keys: [modKey ?? 'Ctrl', 'B'],
      description: 'Toggle sidebar',
    },
    {
      id: 'toggle-theme',
      keys: [modKey ?? 'Ctrl', 'Shift', 'L'],
      description: 'Toggle theme',
    },
    {
      id: 'app-switcher',
      keys: [modKey ?? 'Ctrl', 'Shift', 'S'],
      description: 'Open app switcher',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button className="hidden md:inline-flex" size="icon" variant="ghost">
          <HugeiconsIcon className="size-4" icon={KeyboardIcon} />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Keyboard Shortcuts</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            View all available keyboard shortcuts for faster navigation.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ScrollArea className="max-h-[400px] py-4">
          <div className="space-y-2 pr-4">
            {keybinds.map((keybind) => (
              <div
                className="flex items-center justify-between rounded-md border bg-card p-3"
                key={keybind.id}
              >
                <span className="text-sm">{keybind.description}</span>
                <KbdGroup>
                  {keybind.keys.map((key, index) => (
                    <Kbd key={`${keybind.id}-${index}`}>{key}</Kbd>
                  ))}
                </KbdGroup>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
