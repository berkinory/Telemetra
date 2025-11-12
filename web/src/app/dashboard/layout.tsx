import { Sidebar } from '@/components/ui/sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-main-secondary/20">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
