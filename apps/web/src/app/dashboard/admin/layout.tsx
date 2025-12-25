'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useIsAdmin } from '@/lib/queries/use-admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
