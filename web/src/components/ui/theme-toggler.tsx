'use client';

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { VariantProps } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { type ComponentProps, useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/icon-button';
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
  direction = 'ltr',
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

  if (!mounted) {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        data-slot="theme-toggler-button"
        disabled
        {...props}
      >
        <HugeiconsIcon icon={Sun03Icon} />
      </button>
    );
  }

  if (!resolvedTheme) {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        data-slot="theme-toggler-button"
        disabled
        {...props}
      >
        <HugeiconsIcon icon={Sun03Icon} />
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
          className={cn(buttonVariants({ variant, size, className }))}
          data-slot="theme-toggler-button"
          onClick={(e) => {
            onClick?.(e);
            toggleTheme(getNextTheme(effective, modes));
          }}
          {...props}
        >
          {getIcon(resolved)}
        </button>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
