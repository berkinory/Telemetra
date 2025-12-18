import { ForceDarkTheme } from '@/components/force-dark-theme';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/queries/query-provider';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ForceDarkTheme>
      <QueryProvider>
        {children}
        <Toaster closeButton position="top-center" />
      </QueryProvider>
    </ForceDarkTheme>
  );
}
