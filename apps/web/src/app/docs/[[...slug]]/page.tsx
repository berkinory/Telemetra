import { Robot01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageImage, source } from '@/app/docs/docs-source';
import { CopyMarkdownButton } from '@/components/copy-markdown-button';
import { siteConfig } from '@/lib/seo';

type PageDataWithContent = {
  body: React.ComponentType;
  toc?: Array<{ title: string; url: string; depth: number }>;
  getText: (type: 'raw' | 'processed') => Promise<string>;
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const pageData = page.data as PageDataWithContent;
  const MDX = pageData.body;
  const rawMarkdown = await pageData.getText('raw');
  const isPrivacyPage = page.url.startsWith('/docs/privacy');

  return (
    <DocsPage
      tableOfContent={{
        style: 'clerk',
      }}
      toc={pageData.toc}
    >
      <DocsBody>
        <h1>{page.data.title}</h1>
        {!isPrivacyPage && (
          <div className="mt-2 mb-2 flex items-center gap-2">
            <CopyMarkdownButton content={rawMarkdown} />
            <Link
              className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 font-medium text-sm no-underline shadow-[var(--shadow),var(--highlight)] outline-none transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke,_transform] hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              href="/docs/llms.txt"
              rel="noopener noreferrer"
              target="_blank"
            >
              <HugeiconsIcon icon={Robot01Icon} size={16} />
              llms.txt
            </Link>
          </div>
        )}
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const slug = params.slug?.join('/') ?? '';
  const canonical = slug
    ? `${siteConfig.url}/docs/${slug}`
    : `${siteConfig.url}/docs`;

  return {
    title: `${page.data.title} | Phase Docs`,
    description: page.data.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${page.data.title} | Phase Docs`,
      images: getPageImage(page).url,
    },
  };
}
