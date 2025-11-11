'use client';

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps, CSSProperties } from 'react';
import { useControlledState } from '@/hooks/use-controlled-state';
import { getStrictContext } from '@/lib/get-strict-context';

type SheetContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [SheetProvider, useSheet] =
  getStrictContext<SheetContextType>('SheetContext');

type SheetProps = ComponentProps<typeof SheetPrimitive.Root>;

function Sheet(props: SheetProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return (
    <SheetProvider value={{ isOpen, setIsOpen }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        {...props}
        onOpenChange={setIsOpen}
      />
    </SheetProvider>
  );
}

type SheetTriggerProps = ComponentProps<typeof SheetPrimitive.Trigger>;

function SheetTrigger(props: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

type SheetCloseProps = ComponentProps<typeof SheetPrimitive.Close>;

function SheetClose(props: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

type SheetPortalProps = ComponentProps<typeof SheetPrimitive.Portal>;

function SheetPortal(props: SheetPortalProps) {
  const { isOpen } = useSheet();

  return (
    <AnimatePresence>
      {isOpen && (
        <SheetPrimitive.Portal data-slot="sheet-portal" forceMount {...props} />
      )}
    </AnimatePresence>
  );
}

type SheetOverlayProps = Omit<
  ComponentProps<typeof SheetPrimitive.Overlay>,
  'asChild' | 'forceMount'
> &
  HTMLMotionProps<'div'>;

function SheetOverlay({
  transition = { duration: 0.2, ease: 'easeInOut' },
  ...props
}: SheetOverlayProps) {
  return (
    <SheetPrimitive.Overlay asChild forceMount>
      <motion.div
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        data-slot="sheet-overlay"
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        key="sheet-overlay"
        transition={transition}
        {...props}
      />
    </SheetPrimitive.Overlay>
  );
}

type Side = 'top' | 'bottom' | 'left' | 'right';

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> &
  HTMLMotionProps<'div'> & {
    side?: Side;
  };

function SheetContent({
  side = 'right',
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  style,
  ...props
}: SheetContentProps) {
  const axis = side === 'left' || side === 'right' ? 'x' : 'y';

  const offscreen: Record<Side, { x?: string; y?: string; opacity: number }> = {
    right: { x: '100%', opacity: 0 },
    left: { x: '-100%', opacity: 0 },
    top: { y: '-100%', opacity: 0 },
    bottom: { y: '100%', opacity: 0 },
  };

  const positionStyle: Record<Side, CSSProperties> = {
    right: { insetBlock: 0, right: 0 },
    left: { insetBlock: 0, left: 0 },
    top: { insetInline: 0, top: 0 },
    bottom: { insetInline: 0, bottom: 0 },
  };

  return (
    <SheetPrimitive.Content asChild forceMount {...props}>
      <motion.div
        animate={{ [axis]: 0, opacity: 1 }}
        data-side={side}
        data-slot="sheet-content"
        exit={offscreen[side]}
        initial={offscreen[side]}
        key="sheet-content"
        style={{
          position: 'fixed',
          ...positionStyle[side],
          ...style,
        }}
        transition={transition}
        {...props}
      />
    </SheetPrimitive.Content>
  );
}

type SheetHeaderProps = ComponentProps<'div'>;

function SheetHeader(props: SheetHeaderProps) {
  return <div data-slot="sheet-header" {...props} />;
}

type SheetFooterProps = ComponentProps<'div'>;

function SheetFooter(props: SheetFooterProps) {
  return <div data-slot="sheet-footer" {...props} />;
}

type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title>;

function SheetTitle(props: SheetTitleProps) {
  return <SheetPrimitive.Title data-slot="sheet-title" {...props} />;
}

type SheetDescriptionProps = ComponentProps<typeof SheetPrimitive.Description>;

function SheetDescription(props: SheetDescriptionProps) {
  return (
    <SheetPrimitive.Description data-slot="sheet-description" {...props} />
  );
}

export {
  useSheet,
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetProps,
  type SheetPortalProps,
  type SheetOverlayProps,
  type SheetTriggerProps,
  type SheetCloseProps,
  type SheetContentProps,
  type SheetHeaderProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
};
