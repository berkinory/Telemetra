'use client';

import type * as React from 'react';
import { createContext, useContext } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const ResponsiveContext = createContext<{ isMobile: boolean } | undefined>(
  undefined
);

function useResponsive() {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveDialog');
  }
  return context;
}

type ResponsiveDialogProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function ResponsiveDialog({
  children,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ResponsiveContext.Provider value={{ isMobile }}>
        <Drawer key="mobile-drawer" onOpenChange={onOpenChange} open={open}>
          {children}
        </Drawer>
      </ResponsiveContext.Provider>
    );
  }

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      <Dialog key="desktop-dialog" onOpenChange={onOpenChange} open={open}>
        {children}
      </Dialog>
    </ResponsiveContext.Provider>
  );
}

function ResponsiveDialogTrigger({
  children,
  asChild,
  disabled,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  disabled?: boolean;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <DrawerTrigger asChild={asChild} disabled={disabled}>
        {children}
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger asChild={asChild} disabled={disabled}>
      {children}
    </DialogTrigger>
  );
}

function ResponsiveDialogContent({
  children,
  className,
  showCloseButton,
}: {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <DrawerContent className={className}>
        <div className="px-4">{children}</div>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={className} showCloseButton={showCloseButton}>
      {children}
    </DialogContent>
  );
}

function ResponsiveDialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <DrawerHeader className={className}>{children}</DrawerHeader>;
  }

  return <DialogHeader className={className}>{children}</DialogHeader>;
}

function ResponsiveDialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>;
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
}

function ResponsiveDialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <DrawerDescription className={className}>{children}</DrawerDescription>
    );
  }

  return (
    <DialogDescription className={className}>{children}</DialogDescription>
  );
}

function ResponsiveDialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <DrawerFooter className={className}>
        <div className="flex flex-row justify-end gap-2">{children}</div>
      </DrawerFooter>
    );
  }

  return <DialogFooter className={className}>{children}</DialogFooter>;
}

function ResponsiveDialogClose({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <DrawerClose asChild={asChild}>{children}</DrawerClose>;
  }

  return <DialogClose asChild={asChild}>{children}</DialogClose>;
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
};
