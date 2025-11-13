'use client';

import { type HTMLMotionProps, motion } from 'motion/react';

import {
  Slot,
  type WithAsChild,
} from '@/components/ui/primitives/animate/slot';

type ButtonProps = WithAsChild<
  HTMLMotionProps<'button'> & {
    hoverScale?: number;
    tapScale?: number;
  }
>;

function Button({
  hoverScale = 1.05,
  tapScale = 0.98,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : motion.button;

  return (
    <Component
      whileHover={{ scale: hoverScale, transition: { duration: 0.1 } }}
      whileTap={{ scale: tapScale, transition: { duration: 0.1 } }}
      {...props}
    />
  );
}

export { Button, type ButtonProps };
