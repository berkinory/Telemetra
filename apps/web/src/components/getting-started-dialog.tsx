'use client';

import {
  ArrowRight01Icon,
  BookOpen02Icon,
  File02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';

type GettingStartedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PlatformLinkProps = {
  title: string;
  description: string;
  href: string;
  icon?: ComponentProps<typeof HugeiconsIcon>['icon'];
};

function PlatformLink({ title, description, href, icon }: PlatformLinkProps) {
  return (
    <Link
      className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary hover:bg-accent"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <HugeiconsIcon
          className="size-5 text-primary"
          icon={icon || File02Icon}
        />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <HugeiconsIcon
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
        icon={ArrowRight01Icon}
      />
    </Link>
  );
}

export function GettingStartedDialog({
  open,
  onOpenChange,
}: GettingStartedDialogProps) {
  return (
    <ResponsiveDialog onOpenChange={onOpenChange} open={open}>
      <ResponsiveDialogContent className="max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Getting Started with Phase
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose your platform to start tracking analytics in your application
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="space-y-3 py-4">
          <PlatformLink
            description="Add Phase to your Expo application"
            href="https://phase.sh/docs/get-started/expo"
            icon={BookOpen02Icon}
            title="Expo"
          />
          <PlatformLink
            description="Integrate Phase with React Native"
            href="https://phase.sh/docs/get-started/react-native"
            icon={BookOpen02Icon}
            title="React Native"
          />
          <PlatformLink
            description="Get started with Phase in Swift"
            href="https://phase.sh/docs/get-started/swift"
            icon={BookOpen02Icon}
            title="Swift"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
