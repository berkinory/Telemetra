import {
  Activity03Icon,
  BrowserIcon,
  GithubIcon,
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
          className="h-10 w-auto dark:hidden"
          height={100}
          priority
          src="/light-typography.svg"
          width={150}
        />
        <Image
          alt="Phase"
          className="hidden h-10 w-auto dark:block"
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
  },
  links: [
    {
      type: 'icon',
      text: 'Website',
      icon: createElement(HugeiconsIcon, { icon: BrowserIcon, size: 20 }),
      url: 'https://phase.sh',
      external: true,
    },
    {
      type: 'icon',
      text: 'GitHub',
      icon: createElement(HugeiconsIcon, { icon: GithubIcon, size: 20 }),
      url: 'https://github.com/Phase-Analytics/Phase/',
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
