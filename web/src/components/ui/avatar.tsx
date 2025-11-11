'use client';

import { Avatar as AvatarPrimitive } from '@base-ui-components/react/avatar';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root>;

function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex size-12 select-none items-center justify-center overflow-hidden rounded-full bg-muted align-middle font-medium text-base text-foreground',
        className
      )}
      {...props}
    />
  );
}

type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      className={cn('size-full object-cover', className)}
      {...props}
    />
  );
}

type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center text-base',
        className
      )}
      {...props}
    />
  );
}

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};

export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps };
