'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useIsAdmin } from '@/lib/queries/use-admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isPending } = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!(isPending || isAdmin)) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isPending, router]);

  if (isPending) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
