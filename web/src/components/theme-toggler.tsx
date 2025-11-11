'use client';

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { VariantProps } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { type ComponentProps, useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/icon-button';
import { Blur } from '@/components/ui/primitives/effects/blur';
import {
  type Resolved,
  type ThemeSelection,
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
} from '@/components/ui/primitives/effects/theme-toggler';
import { cn } from '@/lib/utils';

const getIcon = (resolved: Resolved) => {
  if (resolved === 'dark') {
    return <HugeiconsIcon icon={Moon02Icon} />;
  }
  return <HugeiconsIcon icon={Sun03Icon} />;
};

const getNextTheme = (
  effective: ThemeSelection,
  modes: ThemeSelection[]
): ThemeSelection => {
  const i = modes.indexOf(effective);
  if (i === -1) {
    return modes[0];
  }
  return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    modes?: ThemeSelection[];
    onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
    direction?: ThemeTogglerPrimitiveProps['direction'];
  };

function ThemeTogglerButton({
  variant = 'default',
  size = 'default',
  modes = ['light', 'dark'],
  direction = 'rtl',
  onImmediateChange,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isReady = mounted && resolvedTheme;

  if (!isReady) {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          'rounded-full bg-neutral-100 text-neutral-900 shadow-md shadow-neutral-900/20 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-neutral-900/30 dark:hover:bg-neutral-800'
        )}
        data-slot="theme-toggler-button"
        disabled
        {...props}
      >
        <Blur asChild blur={0} initialBlur={10} inView>
          <HugeiconsIcon icon={Sun03Icon} />
        </Blur>
      </button>
    );
  }

  return (
    <ThemeTogglerPrimitive
      direction={direction}
      onImmediateChange={onImmediateChange}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
      theme={theme as ThemeSelection}
    >
      {({ effective, resolved, toggleTheme }) => (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            'rounded-full bg-neutral-100 text-neutral-900 shadow-md shadow-neutral-900/20 hover:bg-neutral-200 hover:shadow-lg dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-neutral-900/30 dark:hover:bg-neutral-800 dark:hover:shadow-xl'
          )}
          data-slot="theme-toggler-button"
          onClick={(e) => {
            onClick?.(e);
            toggleTheme(getNextTheme(effective, modes));
          }}
          {...props}
        >
          <Blur asChild blur={0} initialBlur={0} inView>
            {getIcon(resolved)}
          </Blur>
        </button>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
