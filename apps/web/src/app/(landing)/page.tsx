import {
  CopyrightIcon,
  GithubIcon,
  Mail01Icon,
  NewTwitterIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedFlow from './animation';
import { Footer } from './footer';
import { Header } from './header';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div
        className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 lg:px-8 lg:py-16"
        id="hero"
      >
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <Badge
              className="w-fit text-muted-foreground"
              variant="animated-border"
            >
              <span className="inline-flex items-center">
                <HugeiconsIcon
                  className="mr-1.5 text-muted-foreground"
                  icon={SparklesIcon}
                  size={14}
                />
                BETA IS OUT
              </span>
            </Badge>
            <h1 className="font-regular font-sans text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
              Mobile analytics for developers
            </h1>
            <p className="text-md text-muted-foreground leading-relaxed sm:text-xl">
              Track user behavior, measure engagement, and optimize your product
              with real-time analytics that respects privacy.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/dashboard">
                <Button
                  className="group relative cursor-pointer overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10 font-bold text-md">
                    Start Tracking
                  </span>
                  <div className="-z-0 absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs">
                <Image
                  alt="Swift"
                  className="size-3"
                  height={12}
                  src="https://cdn.simpleicons.org/swift/F05138"
                  width={12}
                />
                Swift
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs">
                <svg className="size-3" fill="#53C1DE" viewBox="0 0 32 32">
                  <title>React Native</title>
                  <path d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z" />
                  <path
                    clipRule="evenodd"
                    d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759ZM9.1037 4.50354C10.9735 3.45416 13.8747 6.00983 15.1159 7.16013C14.2444 8.06754 13.3831 9.1006 12.5603 10.2265C11.1494 10.3533 9.79875 10.5569 8.55709 10.8297C8.09125 9.02071 7.23592 5.55179 9.1037 4.50354ZM20.3793 11.5771C21.3365 11.6942 22.2536 11.85 23.1147 12.0406C22.8562 12.844 22.534 13.6841 22.1545 14.5453C21.6044 13.5333 21.0139 12.5416 20.3793 11.5771ZM16.0143 8.0481C16.6054 8.66897 17.1974 9.3623 17.7798 10.1145C16.5985 10.0603 15.4153 10.0601 14.234 10.1137C14.8169 9.36848 15.414 8.67618 16.0143 8.0481ZM9.8565 14.5444C9.48329 13.6862 9.16398 12.8424 8.90322 12.0275C9.75918 11.8418 10.672 11.69 11.623 11.5748C10.9866 12.5372 10.3971 13.5285 9.8565 14.5444ZM11.6503 20.4657C10.6679 20.3594 9.74126 20.2153 8.88556 20.0347C9.15044 19.2055 9.47678 18.3435 9.85796 17.4668C10.406 18.4933 11.0045 19.4942 11.6503 20.4657ZM16.0498 23.9915C15.4424 23.356 14.8365 22.6531 14.2448 21.8971C15.4328 21.9423 16.6231 21.9424 17.811 21.891C17.2268 22.6608 16.6369 23.3647 16.0498 23.9915ZM22.1667 17.4222C22.5677 18.3084 22.9057 19.1657 23.1742 19.9809C22.3043 20.1734 21.3652 20.3284 20.3757 20.4435C21.015 19.4607 21.6149 18.4536 22.1667 17.4222ZM18.7473 20.5941C16.9301 20.72 15.1016 20.7186 13.2838 20.6044C12.2509 19.1415 11.3314 17.603 10.5377 16.0058C11.3276 14.4119 12.2404 12.8764 13.2684 11.4158C15.0875 11.2825 16.9178 11.2821 18.7369 11.4166C19.7561 12.8771 20.6675 14.4086 21.4757 15.9881C20.6771 17.5812 19.7595 19.1198 18.7473 20.5941ZM22.8303 4.4666C24.7006 5.51254 23.8681 9.22726 23.4595 10.8426C22.2149 10.5641 20.8633 10.3569 19.4483 10.2281C18.6239 9.09004 17.7698 8.05518 16.9124 7.15949C18.1695 5.98441 20.9781 3.43089 22.8303 4.4666Z"
                    fillRule="evenodd"
                  />
                </svg>
                React Native
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <AnimatedFlow
              centerCircle={
                <Image alt="Phase" height={40} src="/logo.svg" width={40} />
              }
              className="w-full"
              innerBadges={[
                {
                  icon: (
                    <svg
                      fill="none"
                      height="12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Realtime</title>
                      <path d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C11.3151 2 10.6462 2.06886 10 2.20004M21.8 10C21.9311 10.6462 22 11.3151 22 12C22 12.6849 21.9311 13.3538 21.8 14M14 21.8C13.3538 21.9311 12.6849 22 12 22C11.3151 22 10.6462 21.9311 10 21.8M2.20004 14C2.06886 13.3538 2 12.6849 2 12C2 11.3151 2.06886 10.6462 2.20004 10M17.5 3.64702C18.6332 4.39469 19.6053 5.36678 20.353 6.5M20.353 17.5C19.6053 18.6332 18.6332 19.6053 17.5 20.353M6.5 20.353C5.36678 19.6053 4.39469 18.6332 3.64702 17.5M3.64702 6.5C4.39469 5.36678 5.36678 4.39469 6.5 3.64702" />
                    </svg>
                  ),
                  text: 'REALTIME UPDATES',
                },
              ]}
              methods={['USERS', 'SESSIONS', 'EVENTS', 'SCREENS']}
              topBadge={{
                icon: (
                  <svg
                    fill="none"
                    height="12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Server Stack</title>
                    <path d="M18 3H6C5.06812 3 4.60218 3 4.23463 3.15224C3.74458 3.35523 3.35523 3.74458 3.15224 4.23463C3 4.60218 3 5.06812 3 6C3 6.93188 3 7.39782 3.15224 7.76537C3.35523 8.25542 3.74458 8.64477 4.23463 8.84776C4.60218 9 5.06812 9 6 9H18C18.9319 9 19.3978 9 19.7654 8.84776C20.2554 8.64477 20.6448 8.25542 20.8478 7.76537C21 7.39782 21 6.93188 21 6C21 5.06812 21 4.60218 20.8478 4.23463C20.6448 3.74458 20.2554 3.35523 19.7654 3.15224C19.3978 3 18.9319 3 18 3Z" />
                    <path d="M18 9H6C5.06812 9 4.60218 9 4.23463 9.15224C3.74458 9.35523 3.35523 9.74458 3.15224 10.2346C3 10.6022 3 11.0681 3 12C3 12.9319 3 13.3978 3.15224 13.7654C3.35523 14.2554 3.74458 14.6448 4.23463 14.8478C4.60218 15 5.06812 15 6 15H18C18.9319 15 19.3978 15 19.7654 14.8478C20.2554 14.6448 20.6448 14.2554 20.8478 13.7654C21 13.3978 21 12.9319 21 12C21 11.0681 21 10.6022 20.8478 10.2346C20.6448 9.74458 20.2554 9.35523 19.7654 9.15224C19.3978 9 18.9319 9 18 9Z" />
                    <path d="M18 15H6C5.06812 15 4.60218 15 4.23463 15.1522C3.74458 15.3552 3.35523 15.7446 3.15224 16.2346C3 16.6022 3 17.0681 3 18C3 18.9319 3 19.3978 3.15224 19.7654C3.35523 20.2554 3.74458 20.6448 4.23463 20.8478C4.60218 21 5.06812 21 6 21H18C18.9319 21 19.3978 21 19.7654 20.8478C20.2554 20.6448 20.6448 20.2554 20.8478 19.7654C21 19.3978 21 18.9319 21 18C21 17.0681 21 16.6022 20.8478 16.2346C20.6448 15.7446 20.2554 15.3552 19.7654 15.1522C19.3978 15 18.9319 15 18 15Z" />
                    <path d="M6 6H6.01" />
                    <path d="M6 12H6.01" />
                    <path d="M6 18H6.01" />
                    <path d="M9 6H9.01" />
                    <path d="M9 12H9.01" />
                    <path d="M9 18H9.01" />
                  </svg>
                ),
                text: 'PHASE INFRASTRUCTURE',
              }}
            />
          </div>
        </div>
      </div>

      <section
        className="mx-auto w-full max-w-5xl px-4 py-16 lg:px-8 lg:py-24"
        id="pricing"
      >
        <div className="text-center">
          <h2 className="mb-3 font-semibold text-muted-foreground text-sm uppercase">
            Pricing
          </h2>
        </div>
      </section>

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
            label: 'PRIVACY POLICY',
          },
          {
            href: 'https://phase.sh/docs/privacy/terms-of-service',
            label: 'TERMS OF SERVICE',
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
          { href: 'https://phase.sh/docs', label: 'DOCUMENTATION' },
          { href: '/dashboard', label: 'DASHBOARD' },
        ]}
        socialLinks={[
          {
            href: 'https://github.com/Phase-Analytics/Phase',
            icon: <HugeiconsIcon icon={GithubIcon} size={20} />,
            label: 'GITHUB',
          },
          {
            href: 'https://x.com/berkinory',
            icon: <HugeiconsIcon icon={NewTwitterIcon} size={20} />,
            label: 'TWITTER',
          },
        ]}
        status={{
          href: 'https://status.phase.sh',
          label: 'STATUS',
        }}
      />
    </div>
  );
}
