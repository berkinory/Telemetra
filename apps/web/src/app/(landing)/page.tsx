import {
  CopyrightIcon,
  GithubIcon,
  Mail01Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { Footer } from './footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1" />
      <Footer
        brandName="Phase Analytics"
        copyright={{
          text: (
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={CopyrightIcon} size={14} />
              <span>2025 Phase Analytics. All rights reserved.</span>
            </span>
          ),
        }}
        email={{
          address: 'support@phase.sh',
          icon: <HugeiconsIcon icon={Mail01Icon} size={14} />,
        }}
        legalLinks={[
          {
            href: 'https://phase.sh/docs/privacy/privacy-policy',
            label: 'Privacy Policy',
          },
          {
            href: 'https://phase.sh/docs/privacy/terms-of-service',
            label: 'Terms of Service',
          },
        ]}
        logo={
          <Image
            alt="Phase Analytics"
            height={32}
            src="/typography.svg"
            width={120}
          />
        }
        mainLinks={[
          { href: 'https://phase.sh/docs', label: 'Documentation' },
          { href: '/dashboard', label: 'Dashboard' },
        ]}
        socialLinks={[
          {
            href: 'https://github.com/Phase-Analytics/Phase',
            icon: <HugeiconsIcon icon={GithubIcon} size={20} />,
            label: 'GitHub',
          },
          {
            href: 'https://x.com/berkinory',
            icon: <HugeiconsIcon icon={NewTwitterIcon} size={20} />,
            label: 'Twitter',
          },
        ]}
        status={{
          href: 'https://status.phase.sh',
          label: 'Status',
        }}
      />
    </div>
  );
}
