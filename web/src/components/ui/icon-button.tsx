'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode, useState } from 'react';

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from '@/components/ui/primitives/buttons/button';
import {
  Particles,
  ParticlesEffect,
} from '@/components/ui/primitives/effects/particles';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "flex shrink-0 items-center justify-center rounded-md outline-none transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-neutral-900/20 shadow-sm hover:bg-primary/90 hover:shadow-md dark:shadow-neutral-950/40',
        accent:
          'bg-accent text-accent-foreground shadow-neutral-900/20 shadow-sm hover:bg-accent/90 hover:shadow-md dark:shadow-neutral-950/40',
        destructive:
          'bg-destructive text-white shadow-red-900/30 shadow-sm hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:shadow-red-950/50 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-neutral-900/10 shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:border-input dark:bg-input/30 dark:shadow-neutral-950/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-neutral-900/20 shadow-sm hover:bg-secondary/80 hover:shadow-md dark:shadow-neutral-950/40',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'size-9',
        xs: "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'size-8 rounded-md',
        lg: 'size-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type IconButtonProps = Omit<ButtonPrimitiveProps, 'asChild'> &
  VariantProps<typeof buttonVariants> & {
    children?: ReactNode;
  };

function IconButton({
  className,
  onClick,
  variant,
  size,
  children,
  ...props
}: IconButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <Particles animate={isActive} asChild key={key}>
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        data-slot="icon-button"
        onClick={(e) => {
          setKey((prev) => prev + 1);
          setIsActive(true);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
        <ParticlesEffect
          className="size-1 rounded-full bg-neutral-500"
          data-variant={variant}
        />
      </ButtonPrimitive>
    </Particles>
  );
}

export { IconButton, buttonVariants, type IconButtonProps };
