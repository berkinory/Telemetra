import { source } from '@/app/docs/docs-source';
import { getLLMText } from '@/lib/get-llm-text';

export const revalidate = false;

export async function GET() {
  const pages = source
    .getPages()
    .filter((page) => !page.url.startsWith('/docs/privacy'));

  const scan = pages.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
