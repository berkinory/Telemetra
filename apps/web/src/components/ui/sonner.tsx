'use client';

import {
  Alert01Icon,
  AlertDiamondIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon className="size-4" icon={CheckmarkCircle02Icon} />
        ),
        info: <HugeiconsIcon className="size-4" icon={InformationCircleIcon} />,
        warning: <HugeiconsIcon className="size-4" icon={Alert01Icon} />,
        error: <HugeiconsIcon className="size-4" icon={AlertDiamondIcon} />,
        loading: <Spinner className="size-4" />,
      }}
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group relative w-full rounded-lg border border-border bg-card p-4 pr-10 shadow-[var(--shadow-elevated)] font-mono flex items-center gap-3',
          title: 'text-sm font-medium text-card-foreground leading-none',
          description: 'text-sm text-muted-foreground mt-1',
          actionButton:
            'bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors',
          cancelButton:
            'bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors',
          closeButton:
            'absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 [&_svg]:size-3.5',
          success:
            'border-success/30 bg-success/10 dark:bg-success/20 [&>[data-icon]]:text-success [&_[data-title]]:text-success [&_[data-description]]:text-success/80 [&_[data-close-button]]:text-success/70 [&_[data-close-button]:hover]:text-success [&_[data-close-button]:hover]:bg-success/20',
          error:
            'border-destructive/30 bg-destructive/10 dark:bg-destructive/20 [&>[data-icon]]:text-destructive [&_[data-title]]:text-destructive [&_[data-description]]:text-destructive/80 [&_[data-close-button]]:text-destructive/70 [&_[data-close-button]:hover]:text-destructive [&_[data-close-button]:hover]:bg-destructive/20',
          warning:
            'border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 [&>[data-icon]]:text-amber-500 [&_[data-title]]:text-amber-500 [&_[data-description]]:text-amber-500/80 [&_[data-close-button]]:text-amber-500/70 [&_[data-close-button]:hover]:text-amber-500 [&_[data-close-button]:hover]:bg-amber-500/20',
          info: 'border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20 [&>[data-icon]]:text-blue-500 [&_[data-title]]:text-blue-500 [&_[data-description]]:text-blue-500/80 [&_[data-close-button]]:text-blue-500/70 [&_[data-close-button]:hover]:text-blue-500 [&_[data-close-button]:hover]:bg-blue-500/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
