'use client';

import { Loading02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useRotateAppKey } from '@/lib/queries';

type RotateKeyDialogProps = {
  appId: string;
  children?: React.ReactNode;
};

export function RotateKeyDialog({ appId, children }: RotateKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const rotateKey = useRotateAppKey();

  const handleRotate = () => {
    rotateKey.mutate(appId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      rotateKey.reset();
    }
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open={open}>
      <ResponsiveDialogTrigger asChild>
        {children || (
          <Button type="button" variant="outline">
            <HugeiconsIcon className="mr-2 size-4" icon={Loading02Icon} />
            Rotate Key
          </Button>
        )}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Rotate API Key</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This will generate a new API key and invalidate the current one.
            Make sure to update your applications with the new key.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="font-medium text-sm">Warning</p>
          <p className="text-muted-foreground text-sm">
            Any applications using the old API key will stop working immediately
            after rotation.
          </p>
        </div>
        <ResponsiveDialogFooter>
          <Button
            disabled={rotateKey.isPending}
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="relative"
            disabled={rotateKey.isPending}
            onClick={handleRotate}
            type="button"
            variant="destructive"
          >
            {rotateKey.isPending && (
              <Spinner className="absolute inset-0 m-auto size-4" />
            )}
            <span className={rotateKey.isPending ? 'invisible' : ''}>
              Rotate Key
            </span>
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
