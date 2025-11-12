'use client';

import { SidebarLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from './separator';

type SidebarProps = {
  children: React.ReactNode;
};

function TopBar({ children }: { children?: React.ReactNode }) {
  return <div className="flex h-[07%] items-center px-6">{children}</div>;
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="h-[93%] p-6">{children}</div>;
}

export function Sidebar({ children }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <aside
          className={`fixed inset-0 z-40 bg-main-secondary transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-[07%] items-center justify-start px-6">
            <button
              className="flex items-center"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} />
            </button>
          </div>
          <Separator orientation="horizontal" />
          <div className="h-[93%]" />
        </aside>

        <main className="w-full bg-main-secondary/20">
          <div className="flex h-full flex-col bg-main">
            <TopBar>
              {!isOpen && (
                <button
                  className="flex items-center"
                  onClick={() => setIsOpen(true)}
                  type="button"
                >
                  <HugeiconsIcon icon={SidebarLeftIcon} />
                </button>
              )}
            </TopBar>
            <Separator orientation="horizontal" />
            <Content>{children}</Content>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <aside className="w-[20%] bg-main-secondary/20" />
      <main className="w-[80%] bg-main-secondary/20 p-2">
        <div className="flex h-full flex-col rounded-xl bg-main">
          <TopBar />
          <Separator orientation="horizontal" />
          <Content>{children}</Content>
        </div>
      </main>
    </>
  );
}
