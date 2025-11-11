'use client';

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import type { CSSProperties, ReactNode, Ref } from 'react';

import {
  Slot,
  type WithAsChild,
} from '@/components/ui/primitives/animate/slot';
import { type UseIsInViewOptions, useIsInView } from '@/hooks/use-is-in-view';
import { getStrictContext } from '@/lib/get-strict-context';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

type ParticlesContextType = {
  animate: boolean;
  isInView: boolean;
};

const [ParticlesProvider, useParticles] =
  getStrictContext<ParticlesContextType>('ParticlesContext');

type ParticlesProps = WithAsChild<
  Omit<HTMLMotionProps<'div'>, 'children'> & {
    animate?: boolean;
    children: ReactNode;
  } & UseIsInViewOptions
>;

function Particles({
  ref,
  animate = true,
  asChild = false,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  children,
  style,
  ...props
}: ParticlesProps) {
  const { ref: localRef, isInView } = useIsInView(ref as Ref<HTMLDivElement>, {
    inView,
    inViewOnce,
    inViewMargin,
  });

  const Component = asChild ? Slot : motion.div;

  return (
    <ParticlesProvider value={{ animate, isInView }}>
      <Component
        ref={localRef}
        style={{ position: 'relative', ...style }}
        {...props}
      >
        {children}
      </Component>
    </ParticlesProvider>
  );
}

type ParticlesEffectProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  side?: Side;
  align?: Align;
  count?: number;
  radius?: number;
  spread?: number;
  duration?: number;
  holdDelay?: number;
  sideOffset?: number;
  alignOffset?: number;
  delay?: number;
};

function ParticlesEffect({
  side = 'top',
  align = 'center',
  count = 6,
  radius = 30,
  spread = 360,
  duration = 0.8,
  holdDelay = 0.05,
  sideOffset = 0,
  alignOffset = 0,
  delay = 0,
  transition,
  style,
  ...props
}: ParticlesEffectProps) {
  const { animate, isInView } = useParticles();

  const isVertical = side === 'top' || side === 'bottom';
  const alignPct = (() => {
    if (align === 'start') {
      return '0%';
    }
    if (align === 'end') {
      return '100%';
    }
    return '50%';
  })();

  const top = (() => {
    if (isVertical) {
      if (side === 'top') {
        return `calc(0% - ${sideOffset}px)`;
      }
      return `calc(100% + ${sideOffset}px)`;
    }
    return `calc(${alignPct} + ${alignOffset}px)`;
  })();

  const left = (() => {
    if (isVertical) {
      return `calc(${alignPct} + ${alignOffset}px)`;
    }
    if (side === 'left') {
      return `calc(0% - ${sideOffset}px)`;
    }
    return `calc(100% + ${sideOffset}px)`;
  })();

  const containerStyle: CSSProperties = {
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
  };

  const angleStep = (spread * (Math.PI / 180)) / Math.max(1, count - 1);

  return (
    <AnimatePresence>
      {animate &&
        isInView &&
        [...new Array(count)].map((_, i) => {
          const angle = i * angleStep;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const key = `particle-${i}-${angle.toFixed(2)}`;

          return (
            <motion.div
              animate={{
                x: `${x}px`,
                y: `${y}px`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              initial={{ scale: 0, opacity: 0 }}
              key={key}
              style={{ ...containerStyle, ...style }}
              transition={{
                duration,
                delay: delay + i * holdDelay,
                ease: 'easeOut',
                ...transition,
              }}
              {...props}
            />
          );
        })}
    </AnimatePresence>
  );
}

export {
  Particles,
  ParticlesEffect,
  type ParticlesProps,
  type ParticlesEffectProps,
};
