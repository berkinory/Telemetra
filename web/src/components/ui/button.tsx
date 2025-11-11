'use client';

import { cva, type VariantProps } from 'class-variance-authority';

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from '@/components/ui/primitives/buttons/button';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8 rounded-md',
        'icon-lg': 'size-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
