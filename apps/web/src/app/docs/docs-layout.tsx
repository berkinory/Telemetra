import {
  Activity03Icon,
  GithubIcon,
  Globe02Icon,
  LinkSquare02Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import Image from 'next/image';
import { createElement } from 'react';

export const baseOptions: Omit<DocsLayoutProps, 'tree'> = {
  nav: {
    title: (
      <div className="flex items-center">
        <Image
          alt="Phase"
          className="h-12 w-auto dark:hidden"
          height={100}
          priority
          src="/light-typography.svg"
          width={150}
        />
        <Image
          alt="Phase"
          className="hidden h-12 w-auto dark:block"
          height={100}
          priority
          src="/typography.svg"
          width={150}
        />
      </div>
    ),
  },
  sidebar: {
    prefetch: false,
    defaultOpenLevel: Number.POSITIVE_INFINITY,
    banner: (
      <a
        className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-secondary/50 px-3 py-1.5 font-medium text-fd-foreground text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        href="https://github.com/Phase-Analytics/Phase/"
        rel="noreferrer noopener"
        target="_blank"
      >
        {createElement(HugeiconsIcon, { icon: GithubIcon, size: 16 })}
        <span className="flex-1">GitHub Repository</span>
        {createElement(HugeiconsIcon, {
          icon: LinkSquare02Icon,
          size: 12,
          className: 'opacity-60',
        })}
      </a>
    ),
  },
  links: [
    {
      type: 'icon',
      text: 'Website',
      icon: createElement(HugeiconsIcon, { icon: Globe02Icon, size: 20 }),
      url: 'https://phase.sh',
      external: true,
    },
    {
      type: 'icon',
      text: 'Status',
      icon: createElement(HugeiconsIcon, { icon: Activity03Icon, size: 20 }),
      url: 'https://status.phase.sh',
      external: true,
    },
    {
      type: 'icon',
      text: 'Mail',
      icon: createElement(HugeiconsIcon, { icon: Mail01Icon, size: 20 }),
      url: 'mailto:support@phase.sh',
      external: true,
    },
  ],
};
